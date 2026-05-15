import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // На главной странице Header встроен в Hero — не показываем отдельный
  if (isHome) return null;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <button className={styles.logo} onClick={() => navigate('/')}>
        ◈ AUDIOSTORE
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        <button onClick={() => { navigate('/catalog'); setMenuOpen(false); }}>Shop</button>
        <button onClick={() => { navigate('/catalog?category=headphones'); setMenuOpen(false); }}>Headphones</button>
        <button onClick={() => { navigate('/catalog?category=speakers'); setMenuOpen(false); }}>Speakers</button>
        <button onClick={() => { navigate('/quiz'); setMenuOpen(false); }}>Find My Sound</button>
      </nav>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => navigate('/auth')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
        <button className={styles.iconBtn} onClick={() => navigate('/cart')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </button>
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}