import { useEffect, useState } from 'react';
// Импортируем нашу новую функцию getAllOrders
import { getAllOrders, updateOrderStatus, deleteOrder } from '../../../services/api';
import { OrderStatus, ORDER_STATUS_LABELS } from '../../../types/order.types';
import type { OrderResponse } from '../../../types/order.types';
import styles from './AdminTab.module.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для загрузки данных
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Теперь вызываем правильный эндпоинт для админа
      const data = await getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Failed to load all orders. Make sure you are logged in as Admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, status: number) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: status as OrderStatus } : o
      ));
    } catch {
      setError('Failed to update status.');
    }
  };

  const handleDelete = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
    } catch {
      setError('Failed to delete order.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tabTitle}>Manage Orders</h2>
        <p className={styles.count}>{orders.length} total orders</p>
        <button className={styles.refreshBtn} onClick={fetchOrders}>Refresh Data</button>
      </div>

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.error}>{error}</p>
          <button onClick={fetchOrders}>Try Again</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>
            <p className={styles.empty}>No orders found in the database.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className={styles.idCell}>#{o.id}</td>
                  <td>
                    <span className={styles.userBadge}>User ID: {o.userId}</span>
                  </td>
                  <td className={styles.priceCell}>
                    {new Intl.NumberFormat('ro-MD', { style: 'currency', currency: 'MDL' }).format(o.totalPrice)}
                  </td>
                  <td>
                    <select
                      className={`${styles.statusSelect} ${styles[`status${o.status}`]}`}
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, Number(e.target.value))}
                    >
                      {Object.entries(ORDER_STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(o.id)}
                      title="Delete Order"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}