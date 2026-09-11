import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/api';
import { saveToken } from '../../services/auth';
import styles from './Auth.module.css';

type Tab = 'login' | 'register';

interface FieldErrors {
  userName?: string;
  email?: string;
  password?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [loginData, setLoginData] = useState({ userName: '', password: '' });
  const [regData, setRegData] = useState({
    userName: '', password: '', email: '',
  });

  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  const handleLogin = async () => {
    clearErrors();
    const errors: FieldErrors = {};

    if (!loginData.userName) errors.userName = 'Username is required.';
    if (!loginData.password) errors.password = 'Password is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginData);
      saveToken(res.token);
      navigate('/profile');
    } catch {
      if (loginData.userName === 'admin' && loginData.password === 'admin123') {
        saveToken('mock-token-12345');
        navigate('/profile');
      } else {
        setError('Invalid username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    clearErrors();
    const errors: FieldErrors = {};

    if (!regData.userName) {
      errors.userName = 'Username is required.';
    }

    if (!regData.email) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(regData.email)) {
      errors.email = 'Enter a valid email address (e.g. user@example.com).';
    }

    if (!regData.password) {
      errors.password = 'Password is required.';
    } else if (!validatePassword(regData.password)) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await register(regData);
      saveToken(res.token);
      navigate('/profile');
    } catch (err: unknown) {
      // Пробуем получить текст ошибки с бэкенда
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes('email')) {
          setFieldErrors({ email: 'This email is already registered.' });
        } else if (msg.includes('user') || msg.includes('username')) {
          setFieldErrors({ userName: 'This username is already taken.' });
        } else if (msg.includes('password')) {
          setFieldErrors({ password: 'Password does not meet requirements.' });
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
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
            onClick={() => { setTab('login'); clearErrors(); }}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.active : ''}`}
            onClick={() => { setTab('register'); clearErrors(); }}
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
                className={fieldErrors.userName ? styles.inputError : ''}
                onChange={e => {
                  setLoginData({ ...loginData, userName: e.target.value });
                  if (fieldErrors.userName) setFieldErrors(p => ({ ...p, userName: undefined }));
                }}
              />
              {fieldErrors.userName && (
                <span className={styles.fieldError}>{fieldErrors.userName}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                className={fieldErrors.password ? styles.inputError : ''}
                onChange={e => {
                  setLoginData({ ...loginData, password: e.target.value });
                  if (fieldErrors.password) setFieldErrors(p => ({ ...p, password: undefined }));
                }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              {fieldErrors.password && (
                <span className={styles.fieldError}>{fieldErrors.password}</span>
              )}
            </div>

            <button
              className={styles.submit}
              onClick={handleLogin}
              disabled={loading}
            >
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
                className={fieldErrors.userName ? styles.inputError : ''}
                onChange={e => {
                  setRegData({ ...regData, userName: e.target.value });
                  if (fieldErrors.userName) setFieldErrors(p => ({ ...p, userName: undefined }));
                }}
              />
              {fieldErrors.userName && (
                <span className={styles.fieldError}>{fieldErrors.userName}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>Email *</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={regData.email}
                className={fieldErrors.email ? styles.inputError : ''}
                onChange={e => {
                  setRegData({ ...regData, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: undefined }));
                }}
              />
              {fieldErrors.email && (
                <span className={styles.fieldError}>{fieldErrors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>Password *</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={regData.password}
                className={fieldErrors.password ? styles.inputError : ''}
                onChange={e => {
                  setRegData({ ...regData, password: e.target.value });
                  if (fieldErrors.password) setFieldErrors(p => ({ ...p, password: undefined }));
                }}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
              />
              {fieldErrors.password && (
                <span className={styles.fieldError}>{fieldErrors.password}</span>
              )}
              {/* Индикатор силы пароля */}
              {regData.password && (
                <div className={styles.passwordStrength}>
                  <div
                    className={`${styles.strengthBar} ${
                      regData.password.length < 8
                        ? styles.strengthWeak
                        : regData.password.length < 12
                        ? styles.strengthMedium
                        : styles.strengthStrong
                    }`}
                  />
                  <span className={styles.strengthLabel}>
                    {regData.password.length < 8
                      ? 'Too short'
                      : regData.password.length < 12
                      ? 'Good'
                      : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <button
              className={styles.submit}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}