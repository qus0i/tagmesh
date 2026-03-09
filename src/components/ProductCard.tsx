import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../lib/types';
import './ProductCard.css';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
  const isOutOfStock = totalStock === 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/products/${product.id}`} className={`product-card card ${isOutOfStock ? 'out-of-stock' : ''}`}>
        <div className="product-card-image-wrap">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name_ar} className="product-card-image" />
          ) : (
            <div className="product-card-placeholder">
              <span className="en">TAGMESH</span>
            </div>
          )}

          {/* Badges */}
          <div className="product-card-badges">
            {hasDiscount && <span className="badge badge-sale">خصم {discountPercent}%</span>}
            {isOutOfStock && <span className="badge badge-out">نفذت الكمية</span>}
          </div>

          {/* Hover overlay */}
          <div className="product-card-overlay">
            <span>شوف التفاصيل</span>
          </div>
        </div>

        <div className="product-card-info">
          <h3 className="product-card-name">{product.name_ar}</h3>
          <p className="product-card-name-en en">{product.name}</p>
          <div className="product-card-price-row">
            {hasDiscount ? (
              <>
                <span className="product-card-price-sale">{product.discount_price} JD</span>
                <span className="product-card-price-old">{product.price} JD</span>
              </>
            ) : (
              <span className="product-card-price">{product.price} JD</span>
            )}
          </div>

          {/* Color dots */}
          {product.variants && product.variants.length > 0 && (
            <div className="product-card-colors">
              {[...new Map(product.variants.map((v) => [v.color_hex, v])).values()].map((v) => (
                <span
                  key={v.color_hex}
                  className="color-dot"
                  style={{ background: v.color_hex }}
                  title={v.color_name_ar}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
