import { useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';


const CATEGORIES = [
  {
    slug: 'headphones',
    label: 'Headphones',
    sub: 'Over-ear & in-ear',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
  },
  {
    slug: 'speakers',
    label: 'Speakers',
    sub: 'Portable & studio',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <circle cx="12" cy="14" r="4"/>
        <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="6" r="1.5"/>
      </svg>
    ),
  },
  {
    slug: 'microphones',
    label: 'Microphones',
    sub: 'Condenser & dynamic',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="9" y="2" width="6" height="11" rx="3"/>
        <path d="M5 10a7 7 0 0 0 14 0"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
      </svg>
    ),
  },
  {
  slug: 'accessories',
  label: 'Accessories',
  sub: 'Cables & cases',
  icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
},
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
            <span className={styles.glyph}>{cat.icon}</span>
            <span className={styles.name}>{cat.label}</span>
            <span className={styles.sub}>{cat.sub}</span>
            <span className={styles.arrow}>→</span>
          </button>
        ))}
      </div>
    </section>
  );
}