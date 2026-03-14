import { supabase } from './supabase';
import type { Product, ProductVariant, Order, DiscountCode, CheckoutFormData, CartItem } from './types';

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) throw error;
  return data || [];
}

// ============================================
// ORDERS
// ============================================

export async function submitOrder(
  customerInfo: CheckoutFormData,
  cartItems: CartItem[],
  discountCode: string | null,
  discountAmount: number,
  subtotal: number,
  total: number
): Promise<Order> {
  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: customerInfo.customer_name,
      phone: customerInfo.phone,
      city: customerInfo.city,
      address: customerInfo.address,
      nearest_landmark: customerInfo.nearest_landmark || null,
      notes: customerInfo.notes || null,
      status: 'pending',
      subtotal,
      discount_code: discountCode,
      discount_amount: discountAmount,
      total,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    variant_id: item.variant.id,
    product_name: item.product.name,
    product_name_ar: item.product.name_ar,
    color: item.variant.color,
    size: item.variant.size,
    quantity: item.quantity,
    unit_price: item.product.discount_price || item.product.price,
    image_url: item.product.images?.[0] || null,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // 3. Decrement stock for each variant
  for (const item of cartItems) {
    const { error: stockError } = await supabase.rpc('decrement_stock', {
      variant_id: item.variant.id,
      qty: item.quantity,
    });
    if (stockError) throw stockError;
  }

  // 4. Increment discount code usage if used
  if (discountCode) {
    await supabase.rpc('increment_discount_usage', {
      code_text: discountCode,
    });
  }

  return order;
}

// ============================================
// DISCOUNT CODES
// ============================================

export async function validateDiscountCode(
  code: string,
  orderAmount: number
): Promise<DiscountCode | null> {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;

  // Check max uses
  if (data.max_uses && data.used_count >= data.max_uses) return null;

  // Check minimum order amount
  if (orderAmount < data.min_order_amount) return null;

  return data;
}

// ============================================
// ADMIN: PRODUCTS
// ============================================

export async function adminGetProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function adminCreateProduct(product: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// ADMIN: VARIANTS
// ============================================

export async function adminCreateVariant(variant: Partial<ProductVariant>): Promise<ProductVariant> {
  const { data, error } = await supabase
    .from('product_variants')
    .insert(variant)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateVariant(id: string, updates: Partial<ProductVariant>): Promise<ProductVariant> {
  const { data, error } = await supabase
    .from('product_variants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteVariant(id: string): Promise<void> {
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// ADMIN: ORDERS
// ============================================

export async function adminGetOrders(status?: string): Promise<Order[]> {
  let query = supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// ADMIN: DISCOUNT CODES
// ============================================

export async function adminGetDiscountCodes(): Promise<DiscountCode[]> {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function adminCreateDiscountCode(code: Partial<DiscountCode>): Promise<DiscountCode> {
  const { data, error } = await supabase
    .from('discount_codes')
    .insert(code)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateDiscountCode(id: string, updates: Partial<DiscountCode>): Promise<DiscountCode> {
  const { data, error } = await supabase
    .from('discount_codes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteDiscountCode(id: string): Promise<void> {
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// ADMIN: IMAGE UPLOAD
// ============================================

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

// ============================================
// ADMIN: DASHBOARD STATS
// ============================================

export async function adminGetDashboardStats() {
  const [ordersResult, productsResult, orderItemsResult] = await Promise.all([
    supabase.from('orders').select('id, status, total, created_at'),
    supabase.from('products').select('id, variants:product_variants(id, stock_quantity)'),
    supabase.from('order_items').select('product_name, quantity, unit_price, order_id')
  ]);

  const orders = ordersResult.data || [];
  const products = productsResult.data || [];
  const orderItems = orderItemsResult.data || [];

  // Summary stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  
  // Calculate total confirmed/delivered revenue
  const validOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  // Low stock calculation
  let lowStockItems = 0;
  products.forEach((p: any) => {
    p.variants?.forEach((v: any) => {
      if (v.stock_quantity > 0 && v.stock_quantity <= 3) lowStockItems++;
    });
  });

  // 1. Orders by Status
  const ordersByStatus = {
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  // 2. Daily Revenue (Last 7 Days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const dailyRevenue = last7Days.map(dateStr => {
    // Orders matching exactly this date
    const dayOrders = validOrders.filter(o => {
      const orderDate = new Date(o.created_at).toISOString().split('T')[0];
      return orderDate === dateStr;
    });
    
    const revenue = dayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    
    // Format date for display: DD/MM
    const [_, month, day] = dateStr.split('-');
    return { date: `${day}/${month}`, revenue };
  });

  // 3. Top Products
  const validOrderIds = new Set(validOrders.map(o => o.id));
  const validOrderItems = orderItems.filter(item => validOrderIds.has(item.order_id));
  
  const productSales: Record<string, number> = {};
  validOrderItems.forEach(item => {
    if (item.product_name) {
      if (!productSales[item.product_name]) productSales[item.product_name] = 0;
      productSales[item.product_name] += item.quantity;
    }
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));

  return { 
    totalOrders, 
    pendingOrders, 
    totalRevenue, 
    lowStockItems, 
    totalProducts: products.length,
    ordersByStatus,
    dailyRevenue,
    topProducts
  };
}
