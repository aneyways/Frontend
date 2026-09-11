import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartItemData } from '../../types/cart.types';
import {
  getLocalCart, removeFromLocalCart,
  updateLocalQuantity, getCartTotal,
} from '../../store/cartStore';
import { getCart, removeCartItem } from '../../services/api';
import { getCurrentUser } from '../../services/auth';
import styles from './CartDrawer.module.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const user = getCurrentUser();
    const localCart = getLocalCart();

    if (user) {
      getCart(user.id)
        .then(cart => {
          const mapped: CartItemData[] = (cart.items as any[]).map(i => {
            const localItem = localCart.find(l => l.productId === i.productId);
            return {
              id: i.id,
              productId: i.productId,
              productName: i.product?.name ?? 'Product',
              unitPrice: i.unitPrice,
              price: i.unitPrice,
              totalPrice: i.totalPrice,
              quantity: i.quantity,
              imageUrl: localItem?.imageUrl ?? i.product?.images?.[0]?.url ?? '',
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
  }, [open]);

  const handleRemove = async (item: CartItemData) => {
    const user = getCurrentUser();
    if (user) {
      try { await removeCartItem(user.id, item.id); } catch { /* ignore */ }
    }
    setItems(removeFromLocalCart(item.id));
  };

  const handleQuantity = (id: number, qty: number) => {
    setItems(updateLocalQuantity(id, qty));
  };

  const total = getCartTotal(items);

  const priceFormatted = (price: number) =>
    new Intl.NumberFormat('ro-MD', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' MDL';

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Your selection</p>
            <h2 className={styles.title}>Cart</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty.</p>
              <button onClick={() => { onClose(); navigate('/catalog'); }}>
                Browse Products →
              </button>
            </div>
          ) : (
            <div className={styles.items}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImg}>
                    <img
                      src={item.imageUrl || PLACEHOLDER}
                      alt={item.productName}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.productName}</p>
                    <p className={styles.itemPrice}>{priceFormatted(item.unitPrice)}</p>
                    <div className={styles.qty}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => handleQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <p className={styles.itemTotal}>
                      {priceFormatted(item.unitPrice * item.quantity)}
                    </p>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>
                {priceFormatted(total >= 1500 ? total : total + 150)}
              </span>
            </div>
            {total < 1500 && (
              <p className={styles.freeHint}>
                Add {priceFormatted(1500 - total)} more for free delivery
              </p>
            )}
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className={styles.fullCartBtn} onClick={handleGoToCart}>
              View Full Cart →
            </button>
          </div>
        )}
      </div>
    </>
  );
}