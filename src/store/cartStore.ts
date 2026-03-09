import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '../lib/types';

interface CartStore {
  items: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number;

  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setDiscount: (code: string, type: 'percentage' | 'fixed', value: number, amount: number) => void;
  clearDiscount: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      discountAmount: 0,
      discountType: null,
      discountValue: 0,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variant.id === variant.id
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems };
          }

          return {
            items: [...state.items, { product, variant, quantity }],
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.variant.id === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], discountCode: null, discountAmount: 0, discountType: null, discountValue: 0 });
      },

      setDiscount: (code, type, value, amount) => {
        set({ discountCode: code, discountType: type, discountValue: value, discountAmount: amount });
      },

      clearDiscount: () => {
        set({ discountCode: null, discountAmount: 0, discountType: null, discountValue: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.discount_price || item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, subtotal - get().discountAmount);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'tagmesh-cart',
    }
  )
);
