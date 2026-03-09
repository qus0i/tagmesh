import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Minus, Plus, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductById } from '../lib/api';
import { useCartStore } from '../store/cartStore';
import type { Product, ProductVariant } from '../lib/types';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        if (data?.variants?.length) {
          const uniqueColors = [...new Map(data.variants.map((v) => [v.color, v])).values()];
          if (uniqueColors.length > 0) setSelectedColor(uniqueColors[0].color);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-page" style={{ paddingTop: 'calc(var(--nav-height) + 60px)' }}><div className="spinner" /></div>;
  if (!product) return <div className="loading-page" style={{ paddingTop: 'calc(var(--nav-height) + 60px)' }}><p>المنتج مش موجود 😕</p></div>;

  const variants = product.variants || [];
  const uniqueColors = [...new Map(variants.map((v) => [v.color, v])).values()];
  const availableSizes = variants
    .filter((v) => v.color === selectedColor)
    .sort((a, b) => {
      const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
      return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
    });

  const selectedVariant: ProductVariant | undefined = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('اختار اللون والمقاس أول! 😅');
      return;
    }
    if (selectedVariant.stock_quantity < quantity) {
      toast.error('الكمية المطلوبة أكثر من الموجود 😔');
      return;
    }
    addItem(product, selectedVariant, quantity);
    toast.success('تمت الإضافة للسلة! 🛒');
    setQuantity(1);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <ChevronRight size={14} />
          <Link to="/products">المنتجات</Link>
          <ChevronRight size={14} />
          <span>{product.name_ar}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                className="product-main-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {product.images?.[selectedImage] ? (
                  <img src={product.images[selectedImage]} alt={product.name_ar} />
                ) : (
                  <div className="product-card-placeholder">
                    <span className="en">TAGMESH</span>
                  </div>
                )}
                {hasDiscount && (
                  <span className="badge badge-sale detail-badge">خصم {discountPercent}%</span>
                )}
              </motion.div>
            </AnimatePresence>

            {product.images && product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            className="product-info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="product-title">{product.name_ar}</h1>
            <p className="product-title-en en">{product.name}</p>

            {/* Price */}
            <div className="product-price-block">
              {hasDiscount ? (
                <>
                  <span className="product-price-current">{product.discount_price} JD</span>
                  <span className="product-price-old">{product.price} JD</span>
                  <span className="badge badge-sale">وفّر {discountPercent}%</span>
                </>
              ) : (
                <span className="product-price-current">{product.price} JD</span>
              )}
            </div>

            {/* Description */}
            {product.description_ar && (
              <p className="product-description">{product.description_ar}</p>
            )}

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div className="product-option">
                <label className="option-label">اللون:</label>
                <div className="color-options">
                  {uniqueColors.map((v) => (
                    <button
                      key={v.color}
                      className={`color-option ${selectedColor === v.color ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedColor(v.color);
                        setSelectedSize(null);
                      }}
                      title={v.color_name_ar}
                    >
                      <span className="color-swatch" style={{ background: v.color_hex }} />
                      <span className="color-name">{v.color_name_ar}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {selectedColor && availableSizes.length > 0 && (
              <div className="product-option">
                <label className="option-label">المقاس:</label>
                <div className="size-options">
                  {availableSizes.map((v) => (
                    <button
                      key={v.size}
                      className={`size-option ${selectedSize === v.size ? 'active' : ''} ${v.stock_quantity === 0 ? 'disabled' : ''}`}
                      onClick={() => v.stock_quantity > 0 && setSelectedSize(v.size)}
                      disabled={v.stock_quantity === 0}
                    >
                      {v.size}
                      {v.stock_quantity === 0 && <span className="size-out">نفذ</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Indicator */}
            {selectedVariant && (
              <div className="stock-info">
                {selectedVariant.stock_quantity === 0 ? (
                  <p className="stock-out">❌ نفذت الكمية من هالمقاس</p>
                ) : selectedVariant.stock_quantity <= 3 ? (
                  <p className="stock-low">
                    <AlertTriangle size={14} /> باقي بس {selectedVariant.stock_quantity} {selectedVariant.stock_quantity === 1 ? 'قطعة' : 'قطع'} — لحقها!
                  </p>
                ) : (
                  <p className="stock-available">
                    ✅ متوفر — باقي {selectedVariant.stock_quantity} قطعة
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="product-option">
              <label className="option-label">الكمية:</label>
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={16} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock_quantity || 10, quantity + 1))}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              className="btn btn-primary btn-lg btn-full add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
            >
              <ShoppingBag size={20} />
              أضف للسلة
            </button>

            {/* Features */}
            <div className="product-features">
              <div className="pf-item">🚚 توصيل مجاني لكل الأردن</div>
              <div className="pf-item">⏰ التوصيل خلال 24 ساعة</div>
              <div className="pf-item">🔍 معاينة قبل الاستلام</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
