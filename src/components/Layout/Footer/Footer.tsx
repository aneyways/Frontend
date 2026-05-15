import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logo}>◈ AUDIOSTORE</span>
          <p className={styles.tagline}>
            Premium audio gear for those<br />who refuse to compromise.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.col}>
            <p className={styles.colTitle}>Shop</p>
            <button onClick={() => navigate('/catalog?category=headphones')}>Headphones</button>
            <button onClick={() => navigate('/catalog?category=speakers')}>Speakers</button>
            <button onClick={() => navigate('/catalog?category=microphones')}>Microphones</button>
            <button onClick={() => navigate('/catalog?category=accessories')}>Accessories</button>
          </div>
          <div className={styles.col}>
            <p className={styles.colTitle}>Account</p>
            <button onClick={() => navigate('/auth')}>Sign In</button>
            <button onClick={() => navigate('/auth?tab=register')}>Register</button>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={() => navigate('/profile/orders')}>My Orders</button>
          </div>
          <div className={styles.col}>
            <p className={styles.colTitle}>Explore</p>
            <button onClick={() => navigate('/quiz')}>Find My Sound</button>
            <button onClick={() => navigate('/compare')}>Compare</button>
            <button onClick={() => navigate('/wishlist')}>Wishlist</button>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} AudioStore. All rights reserved.</p>
        <p>Moldova, Chișinău</p>
      </div>
    </footer>
  );
}