"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Derived
  totalItems: () => number;
  subtotal: () => number;
  discount: () => number;
  shipping: () => number;
  tax: () => number;
  total: () => number;
}

const SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;
const TAX_RATE = 0.18;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.product.originalPrice ?? i.product.price) * i.quantity,
          0
        ),

      discount: () => {
        const items = get().items;
        return items.reduce((sum, i) => {
          const orig = i.product.originalPrice ?? i.product.price;
          const disc = i.product.price;
          return sum + (orig - disc) * i.quantity;
        }, 0);
      },

      shipping: () => {
        const sub = get().subtotal() - get().discount();
        return sub >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
      },

      tax: () => {
        const sub = get().subtotal() - get().discount();
        return Math.round(sub * TAX_RATE);
      },

      total: () => {
        const state = get();
        return (
          state.subtotal() -
          state.discount() +
          state.shipping() +
          state.tax()
        );
      },
    }),
    { name: "aayug-cart" }
  )
);
