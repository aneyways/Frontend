import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartItemData } from '../../types/cart.types';
import {
  getLocalCart, removeFromLocalCart,
  updateLocalQuantity, getCartTotal, clearLocalCart,
} from '../../store/cartStore';
import { getCart, removeCartItem, clearCart } from '../../services/api';
import { getCurrentUser } from '../../services/auth';
import styles from './Cart.module.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const user = getCurrentUser();
  const localCart = getLocalCart();

  if (user) {
    getCart(user.id)
      .then(cart => {
        const mapped: CartItemData[] = (cart.items as any[]).map(i => {
          // Ищем картинку в локальной корзине по productId
          const localItem = localCart.find(l => l.productId === i.productId);
          return {
            id: i.id,
            productId: i.productId,
            productName: i.product?.name ?? 'Product',
            unitPrice: i.unitPrice,
            price: i.unitPrice,
            totalPrice: i.totalPrice,
            quantity: i.quantity,
            // Берём картинку из локальной корзины или из продукта
            imageUrl: localItem?.imageUrl
              ?? i.product?.images?.[0]?.url
              ?? '',
          };
        });
        setItems(mapped);
      })
      .catch(() => setItems(localCart))
      .finally(() => setLoading(false));
  } else {
    setItems(localCart);
    setLoading(false);
  }
}, []);

  const handleRemove = async (item: CartItemData) => {
    const user = getCurrentUser();
    if (user) {
      try {
        await removeCartItem(user.id, item.id);
      } catch { /* используем локальную */ }
    }
    setItems(removeFromLocalCart(item.id));
  };

  const handleQuantity = (id: number, qty: number) => {
    setItems(updateLocalQuantity(id, qty));
  };

  const handleClear = async () => {
    const user = getCurrentUser();
    if (user) {
      try { await clearCart(user.id); } catch { /* ignore */ }
    }
    clearLocalCart();
    setItems([]);
  };

  const total = getCartTotal(items);

  const priceFormatted = (price: number) =>
  new Intl.NumberFormat('ro-MD', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price) + ' MDL';

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <p style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em' }}>
        LOADING...
      </p>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Your selection</span>
        <h1 className={styles.title}>Cart</h1>
        {items.length > 0 && (
          <span className={styles.count}>
            {items.length} item{items.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your cart is empty.</p>
          <button className={styles.cta} onClick={() => navigate('/catalog')}>
            Browse Products →
          </button>
        </div>
      ) : (
        <div className={styles.inner}>
          <div className={styles.items}>
            {items.map(item => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImg}>
                  <img src={item.imageUrl || PLACEHOLDER} alt={item.productName} />
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemCategory}>Audio</p>
                  <h3 className={styles.itemName}>{item.productName}</h3>
                  <p className={styles.itemPrice}>{priceFormatted(item.unitPrice)}</p>
                </div>
                <div className={styles.itemControls}>
                  <div className={styles.qty}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >−</button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                  <p className={styles.itemTotal}>
                    {priceFormatted(item.unitPrice * item.quantity)}
                  </p>
                  <button
                    className={styles.remove}
                    onClick={() => handleRemove(item)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button className={styles.clearBtn} onClick={handleClear}>
              Clear Cart
            </button>
          </div>

          <div className={styles.summary}>
            <p className={styles.summaryTitle}>Order Summary</p>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{priceFormatted(total)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>{total >= 1500 ? 'Free' : priceFormatted(150)}</span>
              </div>
              {total < 1500 && (
                <p className={styles.freeHint}>
                  Add {priceFormatted(1500 - total)} more for free delivery
                </p>
              )}
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{priceFormatted(total >= 1500 ? total : total + 150)}</span>
            </div>
            <button
              className={styles.checkout}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <button
              className={styles.continueShopping}
              onClick={() => navigate('/catalog')}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}