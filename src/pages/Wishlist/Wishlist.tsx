import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';
import { getWishlist, removeFromWishlist } from '../../store/wishlistStore';
import type { WishlistItem } from '../../store/wishlistStore';
import { addToLocalCart } from '../../store/cartStore';
import styles from './Wishlist.module.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth');
      return;
    }
    setItems(getWishlist());
  }, [navigate]);

  const handleRemove = (id: number) => {
    setItems(removeFromWishlist(id));
  };

  const handleMoveToCart = (item: WishlistItem) => {
    addToLocalCart({
      id: item.id,
      productId: item.id,
      productName: item.name,
      unitPrice: item.price,
      price: item.price,
      totalPrice: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    });
    handleRemove(item.id);
  };

  const priceFormatted = (price: number) =>
    new Intl.NumberFormat('ro-MD', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' MDL';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Saved items</span>
        <h1 className={styles.title}>Wishlist</h1>
        {items.length > 0 && (
          <span className={styles.count}>{items.length} item{items.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Your wishlist is empty.</p>
          <button onClick={() => navigate('/catalog')}>
            Browse Products →
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map(item => (
            <div key={item.id} className={styles.card}>
              <div
                className={styles.imgWrap}
                onClick={() => navigate(`/catalog/${item.id}`)}
              >
                <img
                  src={item.imageUrl || PLACEHOLDER}
                  alt={item.name}
                  className={styles.img}
                />
              </div>
              <div className={styles.info}>
                <p className={styles.category}>{item.category ?? 'Audio'}</p>
                <h3
                  className={styles.name}
                  onClick={() => navigate(`/catalog/${item.id}`)}
                >
                  {item.name}
                </h3>
                <p className={styles.price}>{priceFormatted(item.price)}</p>
                <div className={styles.actions}>
                  <button
                    className={styles.cartBtn}
                    onClick={() => handleMoveToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(item.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}