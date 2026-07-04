"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { authApi, cartApi, ApiError } from "@/lib/api";
import { useCartStore } from "./cart.store";

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
          const user: User = {
            id: apiUser.id,
            firstName: apiUser.firstName,
            lastName: apiUser.lastName,
            email: apiUser.email,
            phone: apiUser.phone || "",
            joinedDate: new Date().toISOString(),
          };
          set({ user, accessToken, refreshToken, isAuthenticated: true });

          // Sync cart after successful authentication state set
          try {
            const localItems = useCartStore.getState().items;
            for (const item of localItems) {
              await cartApi.add(item.product.id, item.quantity).catch(console.error);
            }
            const cartRes = await cartApi.get();
            const dbItems = (cartRes as any).data?.items ?? [];
            const items = dbItems.map((item: any) => ({
              product: item.product,
              quantity: item.quantity,
            }));
            useCartStore.setState({ items });
          } catch (cartErr) {
            console.error("Cart sync failed on login:", cartErr);
          }

        } catch (err) {
          const msg = err instanceof ApiError ? err.message : "Login failed";
          set({ error: msg });
          throw err;
        }
      },

      loginDirect: async (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });

        // Sync cart on direct login/registration
        try {
          const localItems = useCartStore.getState().items;
          for (const item of localItems) {
            await cartApi.add(item.product.id, item.quantity).catch(console.error);
          }
          const cartRes = await cartApi.get();
          const dbItems = (cartRes as any).data?.items ?? [];
          const items = dbItems.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
          }));
          useCartStore.setState({ items });
        } catch (cartErr) {
          console.error("Cart sync failed on direct login:", cartErr);
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          await authApi.logout(refreshToken).catch(() => {/* ignore */});
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        useCartStore.setState({ items: [] });
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
