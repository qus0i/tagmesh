import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, Tag, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { validateDiscountCode } from '../lib/api';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, discountCode, discountAmount, setDiscount, clearDiscount } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [validating, setValidating] = useState(false);
  const navigate = useNavigate();

  const handleApplyDiscount = async () => {
    if (!couponInput.trim()) return;
    setValidating(true);
    try {
      const result = await validateDiscountCode(couponInput, getSubtotal());
      if (result) {
        let amount = 0;
        if (result.discount_type === 'percentage') {
          amount = (getSubtotal() * result.discount_value) / 100;
        } else {
          amount = result.discount_value;
        }
        setDiscount(result.code, result.discount_type, result.discount_value, amount);
        toast.success(`تم تطبيق الكود! وفّرت ${amount.toFixed(2)} JD 🎉`);
      } else {
        toast.error('الكود مش صحيح أو منتهي الصلاحية 😕');
      }
    } catch {
      toast.error('صار خطأ — جرب مرة ثانية');
    } finally {
      setValidating(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="cart-empty-content"
            >
              <ShoppingBag size={64} strokeWidth={1} />
              <h2>السلة فاضية! 🛒</h2>
              <p>يلا روح تصفّح الأواعي وعبّيها</p>
              <Link to="/products" className="btn btn-primary btn-lg">تصفّح المنتجات</Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="section-title">سلة التسوق 🛒</h1>
        <p className="section-subtitle">عندك {items.length} {items.length === 1 ? 'قطعة' : 'قطع'} بالسلة</p>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <AnimatePresence>
              {items.map((item) => {
                const price = item.product.discount_price || item.product.price;
                return (
                  <motion.div
                    key={item.variant.id}
                    className="cart-item card"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="cart-item-image">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name_ar} />
                      ) : (
                        <div className="cart-item-placeholder en">TAGMESH</div>
                      )}
                    </div>
                    <div className="cart-item-info">
                      <h3>{item.product.name_ar}</h3>
                      <p className="cart-item-variant">
                        {item.variant.color_name_ar} · {item.variant.size}
                      </p>
                      <p className="cart-item-price">{price} JD</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button className="qty-btn" onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="cart-item-total">{(price * item.quantity).toFixed(2)} JD</div>
                      <button className="cart-item-remove" onClick={() => removeItem(item.variant.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="cart-summary glass">
            <h3 className="summary-title">ملخص الطلب</h3>

            {/* Discount Code */}
            <div className="coupon-section">
              <label className="form-label">عندك كود خصم؟</label>
              {discountCode ? (
                <div className="coupon-applied">
                  <Tag size={16} />
                  <span>{discountCode}</span>
                  <button onClick={clearDiscount} className="coupon-remove">×</button>
                </div>
              ) : (
                <div className="coupon-input-row">
                  <input
                    type="text"
                    placeholder="ادخل الكود هون"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="form-input"
                  />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleApplyDiscount}
                    disabled={validating}
                  >
                    {validating ? '...' : 'تطبيق'}
                  </button>
                </div>
              )}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>المجموع الفرعي</span>
              <span>{getSubtotal().toFixed(2)} JD</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-row summary-discount">
                <span>الخصم</span>
                <span>-{discountAmount.toFixed(2)} JD</span>
              </div>
            )}
            <div className="summary-row">
              <span>التوصيل</span>
              <span className="free-shipping">مجاني 🎉</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <span>الإجمالي</span>
              <span>{getTotal().toFixed(2)} JD</span>
            </div>

            <button
              className="btn btn-primary btn-lg btn-full checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              أكمل الطلب
              <ArrowRight size={18} />
            </button>

            <Link to="/products" className="continue-shopping">← تابع التسوق</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
