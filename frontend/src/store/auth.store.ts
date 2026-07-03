"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { authApi, ApiError } from "@/lib/api";

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
            phone: "",
            joinedDate: new Date().toISOString(),
          };
          set({ user, accessToken, refreshToken, isAuthenticated: true });
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : "Login failed";
          set({ error: msg });
          throw err;
        }
      },

      loginDirect: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          await authApi.logout(refreshToken).catch(() => {/* ignore */});
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      clearError: () => set({ error: null }),
    }),
    {
      name: "aayug-auth",
      // Only persist non-sensitive fields needed for UI
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Keep a demo user for UI fallback when backend isn't connected
export const DEMO_USER: User = {
  id: "demo-1",
  firstName: "XYZ",
  lastName: "Customer",
  email: "xyz@example.com",
  phone: "9876543210",
  joinedDate: "2024-01-15",
};
