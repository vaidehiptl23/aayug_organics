"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { authApi, cartApi, wishlistApi, ApiError, setToken } from "@/lib/api";
import { useCartStore } from "./cart.store";
import { useWishlistStore } from "./wishlist.store";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginDirect: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  // Error
  error: string | null;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,

      login: async (email, password) => {
        set({ error: null });
        try {
          const res = await authApi.login(email, password);
          const { accessToken, refreshToken, user: apiUser } = res.data;
          
          // Write token synchronously to localStorage to ensure immediate fetch requests are authenticated
          setToken(accessToken, refreshToken);
          
          const user: User = {
            id: apiUser.id,
            firstName: apiUser.firstName,
            lastName: apiUser.lastName,
            email: apiUser.email,
            phone: apiUser.phone || "",
            joinedDate: new Date().toISOString(),
          };
          set({ user, accessToken, refreshToken, isAuthenticated: true });

          // Sync cart and wishlist after successful login
          try {
            // Cart sync
            const localCartItems = useCartStore.getState().items;
            for (const item of localCartItems) {
              await cartApi.add(item.product.id, item.quantity).catch(console.error);
            }
            const cartRes = await cartApi.get();
            const dbCartItems = (cartRes as any).data?.items ?? [];
            const cartItems = dbCartItems.map((item: any) => ({
              product: item.product,
              quantity: item.quantity,
            }));
            useCartStore.setState({ items: cartItems });

            // Wishlist sync
            const localWishlistItems = useWishlistStore.getState().items;
            for (const item of localWishlistItems) {
              await wishlistApi.add(item.id).catch(console.error);
            }
            const wishlistRes = await wishlistApi.get();
            const dbWishlistItems = (wishlistRes as any).data ?? [];
            useWishlistStore.setState({ items: dbWishlistItems });

          } catch (syncErr) {
            console.error("Cart/Wishlist sync failed on login:", syncErr);
          }

        } catch (err) {
          const msg = err instanceof ApiError ? err.message : "Login failed";
          set({ error: msg });
          throw err;
        }
      },

      loginDirect: async (user, accessToken, refreshToken) => {
        // Write token synchronously to localStorage to ensure immediate fetch requests are authenticated
        setToken(accessToken, refreshToken);

        set({ user, accessToken, refreshToken, isAuthenticated: true });

        // Sync cart and wishlist on direct login/registration
        try {
          // Cart sync
          const localCartItems = useCartStore.getState().items;
          for (const item of localCartItems) {
            await cartApi.add(item.product.id, item.quantity).catch(console.error);
          }
          const cartRes = await cartApi.get();
          const dbCartItems = (cartRes as any).data?.items ?? [];
          const cartItems = dbCartItems.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
          }));
          useCartStore.setState({ items: cartItems });

          // Wishlist sync
          const localWishlistItems = useWishlistStore.getState().items;
          for (const item of localWishlistItems) {
            await wishlistApi.add(item.id).catch(console.error);
          }
          const wishlistRes = await wishlistApi.get();
          const dbWishlistItems = (wishlistRes as any).data ?? [];
          useWishlistStore.setState({ items: dbWishlistItems });

        } catch (syncErr) {
          console.error("Cart/Wishlist sync failed on direct login:", syncErr);
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          await authApi.logout(refreshToken).catch(() => {/* ignore */});
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        useCartStore.setState({ items: [] });
        useWishlistStore.setState({ items: [] });
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      clearError: () => set({ error: null }),
    }),
    {
      name: "aayug-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const DEMO_USER: User = {
  id: "demo-1",
  firstName: "XYZ",
  lastName: "Customer",
  email: "xyz@example.com",
  phone: "9876543210",
  joinedDate: "2024-01-15",
};
