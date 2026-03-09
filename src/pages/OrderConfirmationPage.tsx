import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, Home } from 'lucide-react';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="confirmation-page">
      <div className="container">
        <motion.div
          className="confirmation-card glass"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Animation */}
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={80} />
          </motion.div>

          <motion.h1
            className="confirmation-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ابشر يا غالي! 🎉
          </motion.h1>

          <motion.p
            className="confirmation-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            طلبك رح يوصلك بأسرع وقت! ✨
          </motion.p>

          {order && (
            <motion.div
              className="order-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="order-detail-row">
                <span>رقم الطلب</span>
                <span className="order-number">#{order.order_number || order.id?.slice(0, 8)}</span>
              </div>
              <div className="order-detail-row">
                <span>الإجمالي</span>
                <span className="order-total">{Number(order.total).toFixed(2)} JD</span>
              </div>
              <div className="order-detail-row">
                <span>الحالة</span>
                <span className="badge badge-warning">قيد المعالجة</span>
              </div>
            </motion.div>
          )}

          <motion.p
            className="confirmation-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            رح نتواصل معك على الرقم يلي عطيتنا إياه عشان نأكدلك الطلب 📱
          </motion.p>

          <motion.div
            className="confirmation-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/" className="btn btn-primary btn-lg">
              <Home size={18} />
              ارجع للرئيسية
            </Link>
            <a
              href="https://wa.me/962"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
            >
              <MessageCircle size={18} />
              تواصل معنا
            </a>
          </motion.div>

          <p className="confirmation-footer">
            شكرًا إنك اخترت طقمش — خليك مطقمش دايمًا! 💯
          </p>
        </motion.div>
      </div>
    </div>
  );
}
