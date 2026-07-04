"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { useAuthStore } from "./auth.store";
import { wishlistApi } from "@/lib/api";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggle: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }

        // Sync to backend if logged in
        if (useAuthStore.getState().isAuthenticated) {
          wishlistApi.add(product.id).catch(console.error);
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        }));

        // Sync to backend if logged in
        if (useAuthStore.getState().isAuthenticated) {
          wishlistApi.remove(productId).catch(console.error);
        }
      },

      toggle: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (productId) =>
        get().items.some((p) => p.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "aayug-wishlist" }
  )
);
