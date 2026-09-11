import { useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from './Checkout.module.css';

interface Props {
  onSuccess: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isTriggered: boolean;
  resetTrigger: () => void;
}

export const StripePaymentForm = ({ onSuccess, setLoading, setError, isTriggered, resetTrigger }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (isTriggered && stripe && elements) {
      handleStripePayment();
      resetTrigger();
    }
  }, [isTriggered, stripe, elements]);

  const handleStripePayment = async () => {
    if (!stripe || !elements) return; // Проверка на null для TS

    setLoading(true);
    setError(null);

    // Используем типизацию через "as any", чтобы обойти конфликты версий Stripe в TS
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/profile',
      },
      redirect: 'if_required',
    } as any);

    if (result.error) {
      setError(result.error.message ?? 'Payment failed');
      setLoading(false);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card} style={{ marginTop: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className={styles.cardTitle}>Secure Payment</p>
      {/* Убрали theme отсюда (она должна быть в Elements) */}
      <PaymentElement options={{ layout: 'tabs' }} />
    </div>
  );
};