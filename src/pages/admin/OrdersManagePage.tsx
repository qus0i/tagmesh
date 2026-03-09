import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetOrders, adminUpdateOrderStatus } from '../../lib/api';
import { ORDER_STATUSES } from '../../lib/types';
import type { Order } from '../../lib/types';
import './AdminPages.css';

export default function OrdersManagePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminGetOrders(filterStatus);
      setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadOrders(); }, [filterStatus]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      toast.success('تم تحديث الحالة ✅');
      loadOrders();
    } catch (err: any) { toast.error(err.message); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-success';
      case 'shipped': return 'badge-success';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return '';
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="admin-content">
      <h1 className="admin-page-title">إدارة الطلبات</h1>
      <p className="admin-page-subtitle">{orders.length} طلب</p>

      {/* Status Filter */}
      <div className="category-filter" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-chip ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>الكل</button>
        {ORDER_STATUSES.map((s) => (
          <button key={s.value} className={`filter-chip ${filterStatus === s.value ? 'active' : ''}`} onClick={() => setFilterStatus(s.value)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="empty-state">ما في طلبات بهالفلتر 📭</p>
        ) : (
          orders.map((order) => (
            <motion.div key={order.id} className="order-card card" layout>
              <div className="order-header" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                <div className="order-main-info">
                  <span className="order-num en">#{order.order_number}</span>
                  <span className="order-customer">{order.customer_name}</span>
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {ORDER_STATUSES.find((s) => s.value === order.status)?.label}
                  </span>
                </div>
                <div className="order-meta">
                  <span>{Number(order.total).toFixed(2)} JD</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleDateString('ar-JO')}</span>
                  {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expandedOrder === order.id && (
                <motion.div className="order-details-expanded" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className="order-detail-grid">
                    <div>
                      <h4>بيانات العميل</h4>
                      <p>📱 {order.phone}</p>
                      <p>📍 {order.city} — {order.address}</p>
                      {order.nearest_landmark && <p>🏠 أقرب معلم: {order.nearest_landmark}</p>}
                      {order.notes && <p>📝 {order.notes}</p>}
                    </div>
                    <div>
                      <h4>تغيير الحالة</h4>
                      <select
                        className="form-input form-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="order-items-list">
                      <h4>المنتجات</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item-row">
                          <div className="oi-image">
                            {item.image_url ? <img src={item.image_url} alt="" /> : <Eye size={16} />}
                          </div>
                          <div className="oi-info">
                            <span>{item.product_name_ar}</span>
                            <span className="oi-variant">{item.color} · {item.size} × {item.quantity}</span>
                          </div>
                          <span className="oi-price">{(item.unit_price * item.quantity).toFixed(2)} JD</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="order-summary-row">
                    {order.discount_code && (
                      <span className="badge badge-success">خصم: {order.discount_code} (-{Number(order.discount_amount).toFixed(2)} JD)</span>
                    )}
                    <span className="order-total-label">الإجمالي: <strong>{Number(order.total).toFixed(2)} JD</strong></span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
