import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetDiscountCodes, adminCreateDiscountCode, adminDeleteDiscountCode, adminUpdateDiscountCode } from '../../lib/api';
import type { DiscountCode } from '../../lib/types';
import './AdminPages.css';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TM-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function DiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: generateCode(),
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_order_amount: '',
    max_uses: '',
    expires_at: '',
  });

  const loadCodes = async () => {
    setLoading(true);
    try {
      const data = await adminGetDiscountCodes();
      setCodes(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadCodes(); }, []);

  const handleCreate = async () => {
    if (!form.code || !form.discount_value) return toast.error('عبّي البيانات المطلوبة');
    try {
      await adminCreateDiscountCode({
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : 0,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        expires_at: form.expires_at || null,
        is_active: true,
      });
      toast.success('تم إنشاء الكود 🎉');
      setShowForm(false);
      setForm({ code: generateCode(), discount_type: 'percentage', discount_value: '', min_order_amount: '', max_uses: '', expires_at: '' });
      loadCodes();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleToggleActive = async (code: DiscountCode) => {
    try {
      await adminUpdateDiscountCode(code.id, { is_active: !code.is_active });
      toast.success(code.is_active ? 'تم تعطيل الكود' : 'تم تفعيل الكود');
      loadCodes();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هالكود؟')) return;
    try {
      await adminDeleteDiscountCode(id);
      toast.success('تم الحذف');
      loadCodes();
    } catch (err: any) { toast.error(err.message); }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('تم نسخ الكود 📋');
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="admin-content">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">أكواد الخصم</h1>
          <p className="admin-page-subtitle">{codes.length} كود</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} /> إنشاء كود جديد
        </button>
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal glass" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="modal-header">
                <h2>إنشاء كود خصم</h2>
                <button onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">الكود</label>
                  <div className="code-input-row">
                    <input className="form-input en" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} dir="ltr" />
                    <button className="btn btn-secondary btn-sm" onClick={() => setForm({ ...form, code: generateCode() })}>توليد عشوائي</button>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">نوع الخصم</label>
                    <select className="form-input form-select" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })}>
                      <option value="percentage">نسبة مئوية %</option>
                      <option value="fixed">مبلغ ثابت JD</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">القيمة *</label>
                    <input type="number" className="form-input" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder={form.discount_type === 'percentage' ? '10' : '5'} dir="ltr" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">الحد الأدنى للطلب (JD)</label>
                    <input type="number" className="form-input" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} placeholder="0" dir="ltr" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الحد الأقصى للاستخدام</label>
                    <input type="number" className="form-input" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="غير محدود" dir="ltr" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">تاريخ الانتهاء</label>
                  <input type="datetime-local" className="form-input" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} dir="ltr" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
                <button className="btn btn-primary" onClick={handleCreate}>إنشاء الكود</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Codes List */}
      <div className="codes-list">
        {codes.length === 0 ? (
          <p className="empty-state">ما في أكواد خصم — أنشئ واحد! 🎫</p>
        ) : (
          codes.map((code) => (
            <div key={code.id} className={`code-card card ${!code.is_active ? 'inactive' : ''}`}>
              <div className="code-header">
                <div className="code-value en" onClick={() => copyCode(code.code)}>
                  {code.code}
                  <Copy size={14} />
                </div>
                <span className={`badge ${code.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {code.is_active ? 'فعّال' : 'معطّل'}
                </span>
              </div>
              <div className="code-details">
                <span>
                  {code.discount_type === 'percentage' ? `${code.discount_value}%` : `${code.discount_value} JD`} خصم
                </span>
                {code.min_order_amount > 0 && <span>الحد الأدنى: {code.min_order_amount} JD</span>}
                <span>الاستخدام: {code.used_count}{code.max_uses ? ` / ${code.max_uses}` : ''}</span>
                {code.expires_at && <span>ينتهي: {new Date(code.expires_at).toLocaleDateString('ar-JO')}</span>}
              </div>
              <div className="code-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => handleToggleActive(code)}>
                  {code.is_active ? 'تعطيل' : 'تفعيل'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(code.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
