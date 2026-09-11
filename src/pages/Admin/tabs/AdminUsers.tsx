import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../../services/api';
import type { UserResponse } from '../../../types/user.types';
import styles from './AdminTab.module.css';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      load();
    } catch {
      setError('Failed to delete user.');
    }
  };

  return (
    <div>
      <div className={styles.tableHeader}>
        <p className={styles.count}>{users.length} users</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className={styles.idCell}>#{u.id}</td>
                <td>{u.userName}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}