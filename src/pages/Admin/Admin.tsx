import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../../services/auth';
import { getAllProducts, getAllUsers } from '../../services/api';
import AdminProducts from './tabs/AdminProducts';
import AdminUsers from './tabs/AdminUsers';
import AdminOrders from './tabs/AdminOrders';
import styles from './Admin.module.css';

type Tab = 'products' | 'users' | 'orders';

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('products');
  const [stats, setStats] = useState({ products: 0, users: 0 });

  useEffect(() => {
    Promise.all([getAllProducts(), getAllUsers()])
      .then(([p, u]) => setStats({ products: p.length, users: u.length }))
      .catch(() => {});
  }, []);

  if (!isAdmin()) {
    return (
      <div style={{
        minHeight: '100vh', background: '#080808',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '2rem'
      }}>
        <p style={{
          fontFamily: 'DM Mono, monospace',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase'
        }}>
          Access Denied
        </p>
        <button onClick={() => navigate('/')} style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          padding: '0.9rem 2rem', background: '#fff', color: '#080808',
          border: 'none', cursor: 'pointer'
        }}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Admin Panel</span>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Products</span>
          <span className={styles.statValue}>{stats.products}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Users</span>
          <span className={styles.statValue}>{stats.users}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Active Tab</span>
          <span className={styles.statValue} style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>
            {tab}
          </span>
        </div>
      </div>

      <div className={styles.tabs}>
        {(['products', 'users', 'orders'] as Tab[]).map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.active : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'products' && <AdminProducts />}
        {tab === 'users' && <AdminUsers />}
        {tab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
}