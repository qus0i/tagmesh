// ============================================
// TagMesh Type Definitions
// ============================================

export interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
  price: number;
  discount_price: number | null;
  category: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  color_name_ar: string;
  color_hex: string;
  size: string;
  stock_quantity: number;
  sku: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  nearest_landmark: string | null;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount_code: string | null;
  discount_amount: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string | null;
  product_name: string;
  product_name_ar: string;
  color: string;
  size: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
  created_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface CartItem {
  variant: ProductVariant;
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  nearest_landmark: string;
  notes: string;
}

export type OrderStatus = Order['status'];

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'confirmed', label: 'تم التأكيد' },
  { value: 'shipped', label: 'تم الشحن' },
  { value: 'delivered', label: 'تم التوصيل' },
  { value: 'cancelled', label: 'ملغي' },
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const JORDANIAN_CITIES = [
  'عمّان',
  'إربد',
  'الزرقاء',
  'العقبة',
  'السلط',
  'مادبا',
  'الكرك',
  'جرش',
  'عجلون',
  'المفرق',
  'الطفيلة',
  'معان',
] as const;

export const CATEGORIES = [
  { value: 'jackets', label: 'جاكيتات' },
  { value: 'jeans', label: 'بناطيل جينز' },
  { value: 'pants', label: 'بناطيل' },
  { value: 'hoodies', label: 'هوديز' },
  { value: 'shirts', label: 'قمصان' },
  { value: 'tshirts', label: 'تيشيرتات' },
  { value: 'accessories', label: 'اكسسوارات' },
] as const;
