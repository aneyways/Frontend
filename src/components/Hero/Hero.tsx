import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import { isAuthenticated } from '../../services/auth';
import CartDrawer from '../CartDrawer/CartDrawer';

export default function Hero() {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <section className={styles.hero}>
        <div className={styles.videoWrap}>
          <video
            className={styles.video}
            src="/videos/beats-jennie.mp4"
            autoPlay muted loop playsInline
          />
          <div className={styles.overlay} />
        </div>

        <div className={styles.content}>
          <nav className={styles.nav}>
            <span className={styles.logo}>◈ AUDIOSTORE</span>

            <div className={styles.navLinks}>
              <button onClick={() => navigate('/catalog')}>Shop</button>
              <button onClick={() => navigate('/catalog?category=headphones')}>Headphones</button>
              <button onClick={() => navigate('/catalog?category=speakers')}>Speakers</button>
              <button onClick={() => navigate('/quiz')}>Find My Sound</button>
            </div>

            <div className={styles.heroActions}>
              <button
                className={styles.iconBtn}
                onClick={() => navigate(isAuthenticated() ? '/profile' : '/auth')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>

              {/* Корзина открывает drawer */}
              <button
                className={styles.iconBtn}
                onClick={() => setCartOpen(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </button>
            </div>
          </nav>

          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Beats Solo 4 × JENNIE</p>
            <h1 className={styles.headline}>
              Sound<br />You Can<br />Wear
            </h1>
            <p className={styles.sub}>Every beat tells a story</p>
            <div className={styles.actions}>
              <button className={styles.cta} onClick={() => navigate('/catalog')}>
                Shop Now
              </button>
              <button className={styles.ghost} onClick={() => navigate('/catalog?collection=jennie')}>
                Jennie Edition →
              </button>
            </div>
          </div>

          <div className={styles.scrollHint}>
            <span />
            <p>Scroll</p>
          </div>
        </div>
      </section>
    </>
  );
}