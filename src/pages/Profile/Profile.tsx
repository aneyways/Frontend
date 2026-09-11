import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/user.types';
import styles from './Profile.module.css';
import { getCurrentUser, removeToken, isAdmin } from '../../services/auth';
import { getUserById, updateUser } from '../../services/api';

const COUNTRIES = [
  'Albania', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium',
  'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece',
  'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kazakhstan', 'Latvia', 'Lithuania',
  'Luxembourg', 'Malta', 'Moldova', 'Montenegro', 'Netherlands', 'North Macedonia',
  'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'Serbia', 'Slovakia',
  'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine',
  'United Kingdom', 'Other',
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate('/auth');
      return;
    }
    getUserById(current.id)
      .then(data => {
        const u: User = {
          id: data.id,
          userName: data.userName,
          email: data.email || current.email,
          phone: data.phone ?? '',
          country: data.country ?? '',
          avatarUrl: data.avatarUrl ?? '',
        };
        setUser(u);
        setForm(u);
        if (data.avatarUrl) setAvatarPreview(data.avatarUrl);
      })
      .catch(() => {
        const u: User = {
          id: current.id,
          userName: current.userName,
          email: current.email,
          phone: '',
          country: '',
          avatarUrl: '',
        };
        setUser(u);
        setForm(u);
      });
  }, [navigate]);

  const handleSave = async () => {
    if (!form || !user) return;
    try {
      await updateUser(user.id, {
        userName: form.userName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        avatarUrl: form.avatarUrl,
      });
    } catch {
      // если бэкенд недоступен — обновляем локально
    }
    setUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      if (form) setForm({ ...form, avatarUrl: result });
    };
    reader.readAsDataURL(file);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    const value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
    setForm({ ...form, phone: value });
  };

  if (!user || !form) return null;

  const initials = user.userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div
          className={styles.avatar}
          onClick={() => editing && fileInputRef.current?.click()}
          style={{ cursor: editing ? 'pointer' : 'default' }}
          title={editing ? 'Click to change photo' : ''}
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="avatar" className={styles.avatarImg} />
          ) : (
            <span>{initials}</span>
          )}
          {editing && (
            <div className={styles.avatarOverlay}>
              <span>Change</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
        <p className={styles.userName}>{user.userName}</p>
        <p className={styles.userEmail}>{user.email}</p>

        <nav className={styles.sideNav}>
          <button className={`${styles.navBtn} ${styles.active}`}>
            Profile
          </button>
          <button
            className={styles.navBtn}
            onClick={() => navigate('/profile/orders')}
          >
            My Orders
          </button>
          {isAdmin() && (
            <button
              className={styles.navBtn}
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </button>
          )}
        </nav>

        <button className={styles.logout} onClick={handleLogout}>
          Sign Out
        </button>
      </aside>

      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div>
            <span className={styles.eyebrow}>Account</span>
            <h1 className={styles.title}>Profile</h1>
          </div>
          {!editing ? (
            <button className={styles.editBtn} onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <div className={styles.editActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => { setEditing(false); setForm(user); setAvatarPreview(user.avatarUrl || null); }}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        {saved && (
          <div className={styles.successMsg}>
            ✓ Profile updated successfully
          </div>
        )}

        <div className={styles.card}>
          <p className={styles.cardTitle}>Personal Information</p>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Username</label>
              {editing ? (
                <input
                  value={form.userName}
                  onChange={e => setForm({ ...form, userName: e.target.value })}
                  maxLength={20}
                />
              ) : (
                <p>{user.userName}</p>
              )}
            </div>
            <div className={styles.field}>
              <label>Email</label>
              {editing ? (
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  maxLength={50}
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={form.phone ?? ''}
                  onChange={handlePhoneInput}
                  placeholder="+373 xx xxx xxx"
                  maxLength={20}
                />
              ) : (
                <p>{user.phone || '—'}</p>
              )}
            </div>
            <div className={styles.field}>
              <label>Country</label>
              {editing ? (
                <select
                  value={form.country ?? ''}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <p>{user.country || '—'}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Security</p>
          <div className={styles.securityRow}>
            <div>
              <p className={styles.secLabel}>Password</p>
              <p className={styles.secValue}>••••••••</p>
            </div>
            <button className={styles.changePassBtn}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 