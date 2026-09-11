import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { getCurrentUser } from '../../services/auth';
import { createOrder, createPaymentIntent } from '../../services/api';
import { getLocalCart, clearLocalCart, getCartTotal } from '../../store/cartStore';
import { StripePaymentForm } from './StripePaymentForm';

import type { OrderCreateDto } from '../../types/order.types';
import styles from './Checkout.module.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const PAYMENT_METHODS = [
  { id: 1, label: 'Card' },
  { id: 2, label: 'Cash on Delivery' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const items = getLocalCart();
  const total = getCartTotal(items);
  const deliveryPrice = total >= 1500 ? 0 : 150;
  const finalTotal = total + deliveryPrice;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: user?.email ?? '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isStripeTriggered, setIsStripeTriggered] = useState(false);

  useEffect(() => {
    if (form.paymentMethod === 1 && finalTotal > 0) {
      createPaymentIntent(finalTotal)
        .then(res => setClientSecret(res.clientSecret))
        .catch(() => setError("Failed to initialize Stripe."));
    }
  }, [form.paymentMethod, finalTotal]);

  const priceFormatted = (price: number) =>
    new Intl.NumberFormat('ro-MD', {
      style: 'currency',
      currency: 'MDL',
      minimumFractionDigits: 0,
    }).format(price);

  const handleOrderCompletion = async () => {
    try {
      setLoading(true);
      const orderData: OrderCreateDto = {
        userId: user?.id ?? 0,
        items: items.map(i => ({
          productId: i.productId,
          productName: i.productName ?? '',
          price: i.unitPrice,
          quantity: i.quantity,
        })),
      };

      await createOrder(orderData);
      clearLocalCart();
      setSuccess(true);
    } catch {
      setError('Order recording failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.address || !form.city) {
      setError('Please fill in all required fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!user) { navigate('/auth'); return; }
    
    setError(null);

    if (form.paymentMethod === 1) {
      setIsStripeTriggered(true);
    } else {
      await handleOrderCompletion();
    }
  };

  // Настройка внешнего вида Stripe
 const appearance: Appearance = {
   theme: 'night',
    variables: {
      colorPrimary: '#ffffff',
      colorBackground: '#0f0f0f',
      colorText: '#ffffff',
    }
  };

  if (success) return (
    <div className={styles.success}>
      <span className={styles.successIcon}>✓</span>
      <h1 className={styles.successTitle}>Order Placed!</h1>
      <button className={styles.successBtn} onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );

  if (items.length === 0) return (
    <div className={styles.empty}>
      <h1 className={styles.emptyTitle}>Empty cart</h1>
      <button className={styles.emptyBtn} onClick={() => navigate('/catalog')}>Browse</button>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Checkout</h1>
      </div>

      <div className={styles.inner}>
        <div className={styles.formSection}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Delivery Information</p>
            <div className={styles.formGrid}>
               <div className={styles.field}>
                <label>First Name *</label>
                <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Last Name *</label>
                <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                <label>Address *</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>City *</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
              {/* Добавь остальные поля по аналогии */}
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.cardTitle}>Payment Method</p>
            <div className={styles.paymentMethods}>
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  type="button"
                  className={`${styles.paymentBtn} ${form.paymentMethod === pm.id ? styles.paymentActive : ''}`}
                  onClick={() => setForm({ ...form, paymentMethod: pm.id })}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {form.paymentMethod === 1 && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
              <StripePaymentForm 
                onSuccess={handleOrderCompletion} 
                loading={loading} 
                setLoading={setLoading} 
                setError={setError} 
                isTriggered={isStripeTriggered}
                resetTrigger={() => setIsStripeTriggered(false)}
              />
            </Elements>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading || (form.paymentMethod === 1 && !clientSecret)}>
            {loading ? 'Processing...' : `Place Order — ${priceFormatted(finalTotal)}`}
          </button>
        </div>

        {/* Summary (оставил как в твоем коде) */}
        <div className={styles.summary}>
          <p className={styles.summaryTitle}>Your Order</p>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{priceFormatted(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}