import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/api';
import styles from './Auth.module.css';

type Tab = 'login' | 'register';

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form
  const [loginData, setLoginData] = useState({ userName: '', password: '' });

  // Register form
  const [regData, setRegData] = useState({
    userName: '', password: '', email: '',
    contacts: '', dob: '', gender: 0,
  });

  const handleLogin = async () => {
    setError(null);
    if (!loginData.userName || !loginData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await login(loginData);
      localStorage.setItem('accessToken', res.token);
      navigate('/');
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    if (!regData.userName || !regData.password || !regData.email) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await register(regData);
      setTab('login');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.logo}>◈ AUDIOSTORE</p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`}
            onClick={() => { setTab('login'); setError(null); }}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.active : ''}`}
            onClick={() => { setTab('register'); setError(null); }}
          >
            Register
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {tab === 'login' && (
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Username</label>
              <input
                type="text"
                placeholder="your_username"
                value={loginData.userName}
                onChange={e => setLoginData({ ...loginData, userName: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <button className={styles.submit} onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        )}

        {tab === 'register' && (
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Username *</label>
              <input
                type="text"
                placeholder="your_username"
                value={regData.userName}
                onChange={e => setRegData({ ...regData, userName: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Email *</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={regData.email}
                onChange={e => setRegData({ ...regData, email: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={regData.password}
                onChange={e => setRegData({ ...regData, password: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Contacts</label>
              <input
                type="text"
                placeholder="+373 ..."
                value={regData.contacts}
                onChange={e => setRegData({ ...regData, contacts: e.target.value })}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={regData.dob}
                  onChange={e => setRegData({ ...regData, dob: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label>Gender</label>
                <select
                  value={regData.gender}
                  onChange={e => setRegData({ ...regData, gender: Number(e.target.value) })}
                >
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                  <option value={2}>Other</option>
                </select>
              </div>
            </div>
            <button className={styles.submit} onClick={handleRegister} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}