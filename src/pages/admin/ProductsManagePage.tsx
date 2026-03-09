import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminCreateVariant, adminUpdateVariant, adminDeleteVariant, uploadProductImage
} from '../../lib/api';
import { CATEGORIES, SIZES } from '../../lib/types';
import type { Product, ProductVariant } from '../../lib/types';
import './AdminPages.css';

export default function ProductsManagePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showVariantForm, setShowVariantForm] = useState<string | null>(null);

  // Product form state
  const [form, setForm] = useState({
    name: '', name_ar: '', description: '', description_ar: '',
    price: '', discount_price: '', category: 'general', images: [] as string[],
  });

  // Variant form state
  const [variantForm, setVariantForm] = useState({
    color: '', color_name_ar: '', color_hex: '#000000', size: 'M', stock_quantity: '0',
  });

  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminGetProducts();
      setProducts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProducts(); }, []);

  const resetForm = () => {
    setForm({ name: '', name_ar: '', description: '', description_ar: '', price: '', discount_price: '', category: 'general', images: [] });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      name_ar: product.name_ar,
      description: product.description || '',
      description_ar: product.description_ar || '',
      price: String(product.price),
      discount_price: product.discount_price ? String(product.discount_price) : '',
      category: product.category,
      images: product.images || [],
    });
    setShowForm(true);
  };

  const handleSaveProduct = async () => {
    if (!form.name_ar || !form.price) return toast.error('عبّي الحقول المطلوبة');
    try {
      const payload = {
        name: form.name,
        name_ar: form.name_ar,
        description: form.description || null,
        description_ar: form.description_ar || null,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        category: form.category,
        images: form.images,
      };

      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, payload);
        toast.success('تم تحديث المنتج ✅');
      } else {
        await adminCreateProduct(payload);
        toast.success('تمت إضافة المنتج 🎉');
      }
      resetForm();
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || 'خطأ بالحفظ');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('متأكد بدك تحذف هالمنتج؟')) return;
    try {
      await adminDeleteProduct(id);
      toast.success('تم الحذف');
      loadProducts();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file);
        urls.push(url);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success('تم رفع الصور 📸');
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSaveVariant = async (productId: string) => {
    if (!variantForm.color || !variantForm.color_name_ar) return toast.error('عبّي بيانات اللون');
    try {
      await adminCreateVariant({
        product_id: productId,
        color: variantForm.color,
        color_name_ar: variantForm.color_name_ar,
        color_hex: variantForm.color_hex,
        size: variantForm.size,
        stock_quantity: parseInt(variantForm.stock_quantity) || 0,
      });
      toast.success('تم إضافة المقاس/اللون ✅');
      setVariantForm({ color: '', color_name_ar: '', color_hex: '#000000', size: 'M', stock_quantity: '0' });
      loadProducts();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleUpdateStock = async (variant: ProductVariant, newStock: number) => {
    const safeStock = Math.max(0, newStock);
    // Optimistically update the local state immediately
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        variants: p.variants?.map((v) =>
          v.id === variant.id ? { ...v, stock_quantity: safeStock } : v
        ),
      }))
    );
    try {
      await adminUpdateVariant(variant.id, { stock_quantity: safeStock });
    } catch (err: any) {
      toast.error(err.message);
      loadProducts(); // revert on error
    }
  };

  const handleDeleteVariant = async (id: string) => {
    if (!confirm('حذف هالمقاس/اللون؟')) return;
    try {
      await adminDeleteVariant(id);
      toast.success('تم الحذف');
      loadProducts();
    } catch (err: any) { toast.error(err.message); }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="admin-content">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">إدارة المنتجات</h1>
          <p className="admin-page-subtitle">{products.length} منتج</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={18} /> إضافة منتج
        </button>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal glass" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="modal-header">
                <h2>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                <button onClick={resetForm}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">اسم المنتج (عربي) *</label>
                    <input className="form-input" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} placeholder="جاكيت بولو" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">اسم المنتج (إنجليزي)</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Polo Jacket" dir="ltr" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">الوصف (عربي)</label>
                  <textarea className="form-input" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} placeholder="قماش ثقيل، شكل كاجوال أنيق..." rows={3} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">السعر (JD) *</label>
                    <input type="number" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="25" dir="ltr" step="0.5" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">سعر الخصم (JD)</label>
                    <input type="number" className="form-input" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} placeholder="20" dir="ltr" step="0.5" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">الفئة</label>
                  <select className="form-input form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">صور المنتج</label>
                  <div className="image-upload-area">
                    {form.images.map((img, i) => (
                      <div key={i} className="uploaded-image">
                        <img src={img} alt="" />
                        <button className="remove-img" onClick={() => removeImage(i)}><X size={14} /></button>
                      </div>
                    ))}
                    <label className="upload-btn">
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
                      {uploading ? '...' : <><Upload size={20} /><span>رفع صور</span></>}
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={resetForm}>إلغاء</button>
                <button className="btn btn-primary" onClick={handleSaveProduct}>
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      <div className="admin-products-list">
        {products.map((product) => (
          <div key={product.id} className="admin-product-card card">
            <div className="ap-header">
              <div className="ap-image">
                {product.images?.[0] ? <img src={product.images[0]} alt="" /> : <ImageIcon size={24} />}
              </div>
              <div className="ap-info">
                <h3>{product.name_ar}</h3>
                <p className="en">{product.name}</p>
                <div className="ap-price">
                  {product.discount_price ? (
                    <>
                      <span className="ap-price-sale">{product.discount_price} JD</span>
                      <span className="ap-price-old">{product.price} JD</span>
                    </>
                  ) : (
                    <span>{product.price} JD</span>
                  )}
                </div>
              </div>
              <div className="ap-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => handleEditProduct(product)}>
                  <Edit2 size={14} /> تعديل
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Variants */}
            <div className="ap-variants">
              <div className="ap-variants-header">
                <h4>المقاسات والألوان ({product.variants?.length || 0})</h4>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowVariantForm(showVariantForm === product.id ? null : product.id)}>
                  <Plus size={14} /> إضافة
                </button>
              </div>

              {showVariantForm === product.id && (
                <div className="variant-form">
                  <input className="form-input" placeholder="اللون (EN)" value={variantForm.color} onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })} />
                  <input className="form-input" placeholder="اللون (عربي)" value={variantForm.color_name_ar} onChange={(e) => setVariantForm({ ...variantForm, color_name_ar: e.target.value })} />
                  <input type="color" value={variantForm.color_hex} onChange={(e) => setVariantForm({ ...variantForm, color_hex: e.target.value })} className="color-picker" />
                  <select className="form-input" value={variantForm.size} onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}>
                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="number" className="form-input" placeholder="الكمية" value={variantForm.stock_quantity} onChange={(e) => setVariantForm({ ...variantForm, stock_quantity: e.target.value })} dir="ltr" />
                  <button className="btn btn-primary btn-sm" onClick={() => handleSaveVariant(product.id)}>حفظ</button>
                </div>
              )}

              {product.variants && product.variants.length > 0 ? (
                <table className="variants-table">
                  <thead>
                    <tr>
                      <th>اللون</th>
                      <th>المقاس</th>
                      <th>المخزون</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <span className="color-dot" style={{ background: v.color_hex }} />
                          {v.color_name_ar}
                        </td>
                        <td>{v.size}</td>
                        <td>
                          <div className="stock-control">
                            <button onClick={() => handleUpdateStock(v, v.stock_quantity - 1)}>-</button>
                            <span className={v.stock_quantity <= 3 ? 'stock-low' : ''}>{v.stock_quantity}</span>
                            <button onClick={() => handleUpdateStock(v, v.stock_quantity + 1)}>+</button>
                          </div>
                        </td>
                        <td>
                          <button className="icon-btn danger" onClick={() => handleDeleteVariant(v.id)}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-variants">لسا ما في مقاسات — ضيف واحد!</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
