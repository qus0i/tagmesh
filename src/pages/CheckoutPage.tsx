import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { submitOrder } from '../lib/api';
import { JORDANIAN_CITIES } from '../lib/types';
import type { CheckoutFormData } from '../lib/types';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, getSubtotal, getTotal, discountCode, discountAmount, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutFormData>({
    customer_name: '',
    phone: '',
    city: '',
    address: '',
    nearest_landmark: '',
    notes: '',
  });

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.customer_name.trim()) return toast.error('ادخل اسمك الكامل');
    if (!form.phone.trim()) return toast.error('ادخل رقم موبايلك');
    if (!form.city) return toast.error('اختار مدينتك');
    if (!form.address.trim()) return toast.error('ادخل عنوانك');

    if (items.length === 0) {
      toast.error('السلة فاضية!');
      return navigate('/products');
    }

    setSubmitting(true);
    try {
      const order = await submitOrder(
        form,
        items,
        discountCode,
        discountAmount,
        getSubtotal(),
        getTotal()
      );
      clearCart();
      navigate(`/order-confirmation/${order.id}`, {
        state: { order, items: items }
      });
    } catch (err: any) {
      console.error(err);
      toast.error('صار خطأ بالطلب — جرب مرة ثانية 😔');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title">تأكيد الطلب 📦</h1>
          <p className="section-subtitle">عبّي بياناتك وبنوصّلك الأواعي لعندك!</p>
        </motion.div>

        <div className="checkout-layout">
          {/* Form */}
          <motion.form
            className="checkout-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="form-section-title">بيانات التوصيل</h3>

            <div className="form-group">
              <label className="form-label">الاسم الكامل *</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثلاً: محمد أحمد الخريسات"
                value={form.customer_name}
                onChange={(e) => updateField('customer_name', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">رقم الموبايل *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="07XXXXXXXX"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                dir="ltr"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">المدينة *</label>
              <select
                className="form-input form-select"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                required
              >
                <option value="">اختار مدينتك</option>
                {JORDANIAN_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">العنوان الكامل *</label>
              <input
                type="text"
                className="form-input"
                placeholder="الشارع، المنطقة، رقم البناية"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">أقرب معلم</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثلاً: قرب مسجد الحسيني، جنب مول الجاليريا"
                value={form.nearest_landmark}
                onChange={(e) => updateField('nearest_landmark', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ملاحظات (اختياري)</label>
              <textarea
                className="form-input"
                placeholder="أي شي بتحب تضيفه..."
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={submitting}
            >
              {submitting ? 'جاري تأكيد الطلب...' : 'أكد الطلب 🚀'}
            </button>
          </motion.form>

          {/* Order Review */}
          <motion.div
            className="checkout-review glass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="form-section-title">ملخص الطلب</h3>

            <div className="review-items">
              {items.map((item) => {
                const price = item.product.discount_price || item.product.price;
                return (
                  <div key={item.variant.id} className="review-item">
                    <div className="review-item-image">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt="" />
                      ) : (
                        <div className="review-placeholder en">T</div>
                      )}
                    </div>
                    <div className="review-item-info">
                      <p className="review-item-name">{item.product.name_ar}</p>
                      <p className="review-item-variant">{item.variant.color_name_ar} · {item.variant.size}</p>
                      <p className="review-item-qty">الكمية: {item.quantity}</p>
                    </div>
                    <p className="review-item-price">{(price * item.quantity).toFixed(2)} JD</p>
                  </div>
                );
              })}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>المجموع الفرعي</span>
              <span>{getSubtotal().toFixed(2)} JD</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-row summary-discount">
                <span>الخصم ({discountCode})</span>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
