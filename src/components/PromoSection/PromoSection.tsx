import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PromoSection.module.css';

function getDeadline() {
  return Date.now() + 72 * 60 * 60 * 1000;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function PromoSection() {
  const navigate = useNavigate();
  const [deadline] = useState(getDeadline);
  const [timeLeft, setTimeLeft] = useState({ h: '72', m: '00', s: '00' });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, deadline - Date.now());
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft({ h: pad(h), m: pad(m), s: pad(s) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.tag}>Limited Edition</span>
          <h2 className={styles.title}>
            Studio Series<br />Noir Collection
          </h2>
          <p className={styles.desc}>
            Hand-finished matte black. Numbered. Only 200 units worldwide.
          </p>
          <button
            className={styles.cta}
            onClick={() => navigate('/catalog?collection=noir')}
          >
            Reserve Yours →
          </button>
        </div>

        <div className={styles.countdown}>
          <p className={styles.countLabel}>Offer ends in</p>
          <div className={styles.units}>
            {[
              { val: timeLeft.h, unit: 'Hrs' },
              { val: timeLeft.m, unit: 'Min' },
              { val: timeLeft.s, unit: 'Sec' },
            ].map(({ val, unit }) => (
              <div key={unit} className={styles.unit}>
                <span className={styles.num}>{val}</span>
                <span className={styles.unitLabel}>{unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}