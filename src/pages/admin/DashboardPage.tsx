import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';
import { adminGetDashboardStats } from '../../lib/api';
import './AdminPages.css';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="admin-content">
      <h1 className="admin-page-title">لوحة التحكم</h1>
      <p className="admin-page-subtitle">مرحبا! هون بتشوف كل شي عن طقمش 📊</p>

      <div className="stats-grid">
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <div className="stat-icon" style={{ background: 'rgba(52,152,219,0.1)', color: '#3498db' }}><ShoppingCart size={24} /></div>
          <div className="stat-info">
            <p className="stat-value">{stats?.totalOrders || 0}</p>
            <p className="stat-label">إجمالي الطلبات</p>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon" style={{ background: 'rgba(243,156,18,0.1)', color: '#f39c12' }}><Package size={24} /></div>
          <div className="stat-info">
            <p className="stat-value">{stats?.pendingOrders || 0}</p>
            <p className="stat-label">طلبات بانتظار التأكيد</p>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.1)', color: '#27ae60' }}><DollarSign size={24} /></div>
          <div className="stat-info">
            <p className="stat-value">{(stats?.totalRevenue || 0).toFixed(2)} JD</p>
            <p className="stat-label">إجمالي الإيرادات</p>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c' }}><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <p className="stat-value">{stats?.lowStockItems || 0}</p>
            <p className="stat-label">قطع قربت تخلص</p>
          </div>
        </motion.div>
      </div>

      <div className="quick-links">
        <h3>وصول سريع</h3>
        <div className="quick-links-grid">
          <Link to="/admin/products" className="quick-link card">
            <Package size={20} />
            <span>إدارة المنتجات</span>
          </Link>
          <Link to="/admin/orders" className="quick-link card">
            <ShoppingCart size={20} />
            <span>إدارة الطلبات</span>
          </Link>
          <Link to="/admin/discounts" className="quick-link card">
            <DollarSign size={20} />
            <span>أكواد الخصم</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
