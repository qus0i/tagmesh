import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../lib/api';
import { CATEGORIES } from '../lib/types';
import type { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    getProducts(activeCategory)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const setCategory = (cat: string) => {
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title">المنتجات</h1>
          <p className="section-subtitle">تصفّح أحلى الأواعي — كلها بين إيديك 🛒</p>
        </motion.div>

        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            الكل
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`filter-chip ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>😅 ما في منتجات بهالقسم حاليًا — بس ارجع قريب!</p>
          </div>
        )}
      </div>
    </div>
  );
}
