import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

export default function Cart() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Your selection</span>
        <h1 className={styles.title}>Cart</h1>
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your cart is empty.</p>
          <button className={styles.cta} onClick={() => navigate('/catalog')}>
            Browse Products →
          </button>
        </div>
      </div>
    </div>
  );
}