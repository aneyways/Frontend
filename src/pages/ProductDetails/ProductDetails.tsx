import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.eyebrow}>Product #{id}</span>
      <h1 className={styles.title}>Coming Soon.</h1>
      <button className={styles.cta} onClick={() => navigate('/catalog')}>
        ← Back to Catalog
      </button>
    </div>
  );
}