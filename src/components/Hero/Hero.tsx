import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      {/* VIDEO BACKGROUND */}
      <div className={styles.videoWrap}>
        <video
        className={styles.video}
        src="/videos/beats-jennie.mp4"
        autoPlay
        muted
        loop
        playsInline
        />
        <div className={styles.overlay} />
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <nav className={styles.nav}>
          <span className={styles.logo}>◈ AUDIOSTORE</span>
          <div className={styles.navLinks}>
            <button onClick={() => navigate('/catalog')}>Shop</button>
            <button onClick={() => navigate('/catalog?category=headphones')}>Headphones</button>
            <button onClick={() => navigate('/catalog?category=speakers')}>Speakers</button>
            <button onClick={() => navigate('/quiz')}>Find My Sound</button>
          </div>
          <button className={styles.cartBtn}>Cart (0)</button>
        </nav>

        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Beats Solo 4 × JENNIE</p>
          <h1 className={styles.headline}>
            Sound<br />You Can<br />Wear
          </h1>
          <p className={styles.sub}>
            Every beat tells a story
          </p>
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
  );
}