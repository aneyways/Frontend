import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../../services/auth';
import CartDrawer from '../../CartDrawer/CartDrawer';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setAdmin(isAdmin());
  }, [location.pathname]);

  if (isHome) return null;

  return (
    <>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <button className={styles.logo} onClick={() => navigate('/')}>
          ◈ AUDIOSTORE
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <button onClick={() => { navigate('/catalog'); setMenuOpen(false); }}>Shop</button>
          <button onClick={() => { navigate('/catalog?category=headphones'); setMenuOpen(false); }}>Headphones</button>
          <button onClick={() => { navigate('/catalog?category=speakers'); setMenuOpen(false); }}>Speakers</button>
          <button onClick={() => { navigate('/quiz'); setMenuOpen(false); }}>Find My Sound</button>
          {admin && (
            <button onClick={() => { navigate('/admin'); setMenuOpen(false); }}>Admin</button>
          )}
        </nav>

        <div className={styles.actions}>
          <button
  className={styles.iconBtn}
  onClick={() => navigate('/wishlist')}
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
</button>
          <button
            className={styles.iconBtn}
            onClick={() => navigate(authed ? '/profile' : '/auth')}
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

          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
    </>
  );
}