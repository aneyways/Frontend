import styles from './WhyUs.module.css';

const PILLARS = [
  {
    glyph: '◈',
    title: 'Premium Sound',
    desc: 'Every product is tuned by audio engineers with 20+ years of experience in professional studios.',
  },
  {
    glyph: '⬡',
    title: 'Fast Delivery',
    desc: 'Same-day dispatch for orders placed before 15:00. Free shipping across Moldova on orders over 1500 MDL.',
  },
  {
    glyph: '◎',
    title: '2-Year Warranty',
    desc: 'Full manufacturer warranty on all products. Hassle-free returns within 30 days — no questions asked.',
  },
];

export default function WhyUs() {
  return (
    <section className={styles.section}>
      <span className={styles.label}>Why AudioStore</span>
      <h2 className={styles.title}>Built for the serious listener.</h2>
      <div className={styles.grid}>
        {PILLARS.map((p) => (
          <div key={p.title} className={styles.pillar}>
            <span className={styles.glyph}>{p.glyph}</span>
            <h3 className={styles.pillarTitle}>{p.title}</h3>
            <p className={styles.pillarDesc}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}