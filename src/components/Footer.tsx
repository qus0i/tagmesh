import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Clock, Truck } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="pattern-divider" />
      <div className="container footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <div className="footer-brand">
              <span className="en footer-logo-text">TAGMESH</span>
              <span className="footer-logo-ar">طقمش</span>
            </div>
            <p className="footer-tagline">خليك مطقمش ✨</p>
            <p className="footer-desc">
              براند أردني بيقدملك أحلى الأواعي الأوروبية بأسعار حلوة وتوصيل سريع لعندك
            </p>
            <div className="footer-social">
              <a href="https://instagram.com/tagmesh.jo" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/962" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-section">
            <h4 className="footer-heading">روابط سريعة</h4>
            <Link to="/" className="footer-link">الرئيسية</Link>
            <Link to="/products" className="footer-link">المنتجات</Link>
            <Link to="/cart" className="footer-link">السلة</Link>
          </div>

          {/* Info */}
          <div className="footer-section">
            <h4 className="footer-heading">ليش طقمش؟</h4>
            <div className="footer-feature">
              <Truck size={16} />
              <span>توصيل مجاني وسريع</span>
            </div>
            <div className="footer-feature">
              <Clock size={16} />
              <span>توصيل خلال 24 ساعة</span>
            </div>
            <div className="footer-feature">
              <MapPin size={16} />
              <span>لجميع أنحاء الأردن</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TAGMESH | طقمش — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
