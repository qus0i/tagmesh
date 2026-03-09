-- ============================================
-- FIX: Drop and recreate RLS policies with proper WITH CHECK
-- Run this in the Supabase SQL Editor
-- ============================================

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admin manage products" ON products;
DROP POLICY IF EXISTS "Admin manage variants" ON product_variants;
DROP POLICY IF EXISTS "Admin manage orders" ON orders;
DROP POLICY IF EXISTS "Admin manage order items" ON order_items;
DROP POLICY IF EXISTS "Admin manage discount codes" ON discount_codes;

-- Recreate with both USING and WITH CHECK
CREATE POLICY "Admin manage products" ON products
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage variants" ON product_variants
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage orders" ON orders
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage order items" ON order_items
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage discount codes" ON discount_codes
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
