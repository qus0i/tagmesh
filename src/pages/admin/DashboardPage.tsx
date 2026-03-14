import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, BarChart2, CheckCircle, Clock, XCircle } from 'lucide-react';
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

  // Helpers for charts
  const maxRevenue = stats?.dailyRevenue ? Math.max(...stats.dailyRevenue.map((d: any) => d.revenue), 1) : 1;
  const maxProductQty = stats?.topProducts?.length ? Math.max(...stats.topProducts.map((p: any) => p.quantity), 1) : 1;
  const totalOrdersCount = stats?.totalOrders || 1; // prevent divide by zero

  const statusColors: any = {
    pending: '#ca8a04',
    confirmed: '#2563eb',
    shipped: '#8b5cf6',
    delivered: '#16a34a',
    cancelled: '#dc2626'
  };

  const statusLabels: any = {
    pending: 'قيد الانتظار',
    confirmed: 'تم التأكيد',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي'
  };

  return (
    <div className="admin-content">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">لوحة التحكم</h1>
          <p className="admin-page-subtitle">نظرة عامة على أداء المتجر والمبيعات 📊</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><DollarSign size={24} /></div>
          <div className="stat-info">
            <p className="stat-value">{(stats?.totalRevenue || 0).toFixed(2)} JD</p>
            <p className="stat-label">إجمالي الإيرادات</p>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><ShoppingCart size={24} /></div>
          <div className="stat-info">
            <p className="stat-value">{stats?.totalOrders || 0}</p>
            <p className="stat-label">إجمالي الطلبات</p>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon" style={{ background: '#fefce8', color: '#ca8a04' }}><Clock size={24} /></div>
          <div className="stat-info">
            <p className="stat-value">{stats?.pendingOrders || 0}</p>
            <p className="stat-label">بانتظار التأكيد</p>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <p className="stat-value">{stats?.lowStockItems || 0}</p>
            <p className="stat-label">منتجات منخفضة المخزون</p>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-grid">
        {/* Revenue Chart */}
        <div className="dashboard-panel chart-panel">
          <div className="panel-header">
            <h3><TrendingUp size={18} /> الإيرادات (آخر 7 أيام)</h3>
          </div>
          <div className="bar-chart-container">
            {stats?.dailyRevenue?.map((day: any, i: number) => {
              const heightPct = Math.max((day.revenue / maxRevenue) * 100, 2); // Minimum 2% height for visibility
              return (
                <div key={i} className="bar-column">
                  <div className="bar-value">{day.revenue} JD</div>
                  <div className="bar-wrapper">
                    <motion.div 
                      className="bar-fill" 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  <div className="bar-label">{day.date}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders Status */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3><Package size={18} /> حالة الطلبات</h3>
          </div>
          <div className="status-bars">
            {Object.entries(stats?.ordersByStatus || {}).map(([status, count]: [string, any], i) => {
              const widthPct = Math.max(((count as number) / totalOrdersCount) * 100, 2);
              return (
                <div key={status} className="status-row">
                  <div className="status-label-row">
                    <span>{statusLabels[status] || status}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="status-progress-bg">
                    <motion.div 
                      className="status-progress-fill"
                      style={{ backgroundColor: statusColors[status] || '#111' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3><BarChart2 size={18} /> أكثر المنتجات مبيعاً</h3>
          </div>
          <div className="top-products-list">
            {stats?.topProducts?.length > 0 ? (
              stats.topProducts.map((p: any, i: number) => {
                const widthPct = Math.max((p.quantity / maxProductQty) * 100, 5);
                return (
                  <div key={i} className="top-product-item">
                    <div className="tp-info">
                      <span className="tp-name">{p.name}</span>
                      <span className="tp-qty">{p.quantity} قطعة</span>
                    </div>
                    <div className="tp-bar-bg">
                      <motion.div 
                        className="tp-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-data-msg">لا توجد بيانات مبيعات كافية حتى الآن.</p>
            )}
          </div>
        </div>
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
