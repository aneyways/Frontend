import { useNavigate } from 'react-router-dom';
import styles from './Quiz.module.css';

export default function Quiz() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <span className={styles.eyebrow}>Personalised for you</span>
      <h1 className={styles.title}>Find Your<br />Perfect Sound.</h1>
      <p className={styles.sub}>
        Answer a few questions and we'll match you with the ideal audio gear.
      </p>
      <button className={styles.cta} onClick={() => navigate('/catalog')}>
        Start Quiz →
      </button>
    </div>
  );
}