import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Clock, Truck, Linkedin } from 'lucide-react';
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
              <a href="https://wa.me/962779005522" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
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
          <p className="footer-powered-by" dir="ltr">
            <a href="https://www.linkedin.com/in/qusai-kanaan-385172288/" target="_blank" rel="noopener noreferrer" className="powered-linkedin-icon" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 72 72"><rect width="72" height="72" rx="8" fill="#555555"/><path d="M20.5 29h7v22h-7zM24 18.5a4 4 0 110 8 4 4 0 010-8zM33 29h6.7v3h.1c.9-1.8 3.2-3.6 6.6-3.6 7 0 8.3 4.6 8.3 10.6V51h-7V40.6c0-2.5 0-5.7-3.5-5.7s-4 2.7-4 5.5V51h-7V29z" fill="#fff"/></svg>
            </a>
            Powered by <a href="https://www.linkedin.com/in/qusai-kanaan-385172288/" target="_blank" rel="noopener noreferrer" className="enqust-link">Qusai</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
