import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../services/auth';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../../store/wishlistStore';
import type { WishlistItem } from '../../store/wishlistStore';
import styles from './WishlistButton.module.css';

interface Props {
  item: WishlistItem;
  size?: number;
}

export default function WishlistButton({ item, size = 20 }: Props) {
  const [liked, setLiked] = useState(false);
  const [authed] = useState(isAuthenticated());

  useEffect(() => {
    setLiked(isInWishlist(item.id));
  }, [item.id]);

  if (!authed) return null;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      removeFromWishlist(item.id);
      setLiked(false);
    } else {
      addToWishlist(item);
      setLiked(true);
    }
  };

  return (
    <button
      className={`${styles.btn} ${liked ? styles.liked : ''}`}
      onClick={toggle}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        width={size} height={size}
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}