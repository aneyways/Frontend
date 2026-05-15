import { useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';

const CATEGORIES = [
  { slug: 'headphones',  label: 'Headphones',  glyph: '◎', sub: 'Over-ear & in-ear' },
  { slug: 'speakers',    label: 'Speakers',    glyph: '◈', sub: 'Portable & studio' },
  { slug: 'microphones', label: 'Microphones', glyph: '◐', sub: 'Condenser & dynamic' },
  { slug: 'accessories', label: 'Accessories', glyph: '◇', sub: 'Cables & cases' },
];

export default function Categories() {
  const navigate = useNavigate();
  return (
    <section className={styles.section}>
      <span className={styles.label}>Browse by</span>
      <h2 className={styles.title}>Categories</h2>
      <div className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            className={styles.card}
            onClick={() => navigate(`/catalog?category=${cat.slug}`)}
          >
            <span className={styles.glyph}>{cat.glyph}</span>
            <span className={styles.name}>{cat.label}</span>
            <span className={styles.sub}>{cat.sub}</span>
            <span className={styles.arrow}>→</span>
          </button>
        ))}
      </div>
    </section>
  );
}