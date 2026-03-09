import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Shield, Clock, Star } from 'lucide-react';
import { getFeaturedProducts } from '../lib/api';
import type { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then(setFeatured)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">🇯🇴 براند أردني أصيل</span>
            <h1 className="hero-title">
              <span className="en hero-title-en">TAGMESH</span>
              <span className="hero-title-ar">طقمش</span>
            </h1>
            <p className="hero-subtitle">خليك مطقمش</p>
            <p className="hero-desc">
              ستايل أوروبي بطعم أردني — أحلى الأواعي بأسعار تهبل وتوصيل لعندك ع الباب 🔥
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                تصفّح الأواعي
              </Link>
              <a href="https://instagram.com/tagmesh.jo" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
                تابعنا ع الإنستا
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating badges */}
        <motion.div
          className="hero-float hero-float-1"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔥
        </motion.div>
        <motion.div
          className="hero-float hero-float-2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          ✨
        </motion.div>
      </section>

      {/* Features Strip */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <div className="feature-icon"><Truck size={24} /></div>
              <div>
                <h4>توصيل مجاني</h4>
                <p>لكل أنحاء المملكة</p>
              </div>
            </motion.div>
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="feature-icon"><Clock size={24} /></div>
              <div>
                <h4>توصيل سريع</h4>
                <p>خلال 24 ساعة</p>
              </div>
            </motion.div>
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="feature-icon"><Shield size={24} /></div>
              <div>
                <h4>جودة أوروبية</h4>
                <p>أقمشة فاخرة ومستوردة</p>
              </div>
            </motion.div>
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="feature-icon"><Star size={24} /></div>
              <div>
                <h4>معاينة قبل الاستلام</h4>
                <p>شوف القطعة قبل ما تدفع</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">آخر الأواعي 🔥</h2>
            <p className="section-subtitle">أحدث القطع يلي وصّلتنا — لا تفوّتهم</p>
          </motion.div>

          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : featured.length > 0 ? (
            <div className="product-grid">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>قريبًا بنضيف أواعي جديدة — تابعنا! 👀</p>
            </div>
          )}

          <div className="section-cta">
            <Link to="/products" className="btn btn-secondary">شوف كل المنتجات</Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section brand-section">
        <div className="container">
          <div className="brand-story glass">
            <div className="brand-story-pattern" />
            <motion.div
              className="brand-story-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">شو يعني طقمش؟ 🤔</h2>
              <p>
                طقمش كلمة من قلب الشارع الأردني — لما حدا يتلبّس وكله بجنن من فوق لتحت بنقوله
                <strong> "مطقمش"</strong>! 💯
              </p>
              <p>
                إحنا بطقمش هدفنا نخليك دايمًا <strong>مطقمش</strong> — بأحلى 
                الأواعي الأوروبية بجودة عالية وأسعار تناسب الجيبة، مع توصيل سريع لعند بابك 
                وين ما كنت بالأردن 🇯🇴
              </p>
              <p className="brand-cta">
                <strong>خليك مطقمش... خليك معنا ✌️</strong>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
