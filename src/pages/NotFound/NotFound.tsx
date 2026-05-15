import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found.</h1>
      <p className={styles.sub}>The page you're looking for doesn't exist or has been moved.</p>
      <button className={styles.cta} onClick={() => navigate('/')}>
        Back to Home →
      </button>
    </div>
  );
}