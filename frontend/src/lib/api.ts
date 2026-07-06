/**
 * Aayug Organics – Frontend API Client
 *
 * Wraps all backend REST calls. Automatically attaches the JWT token
 * from localStorage and handles token refresh on 401.
 *
 * Base URL comes from NEXT_PUBLIC_API_URL env var so it works both
 * locally (http://localhost:5000/api/v1) and in production without
 * any code changes.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

// ─── Token helpers ───────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const auth = JSON.parse(localStorage.getItem("aayug-auth") ?? "{}");
    return auth?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

export function setToken(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("aayug-auth") ?? "{}";
    const store = JSON.parse(raw);
    store.state = { ...(store.state ?? {}), accessToken, refreshToken };
    localStorage.setItem("aayug-auth", JSON.stringify(store));
  } catch { /* noop */ }
}

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...fetchOptions, headers });

  // Auto-refresh on 401
  if (res.status === 401 && !skipAuth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const retryHeaders = { ...headers, Authorization: `Bearer ${getToken()}` };
      const retry = await fetch(`${BASE}${path}`, { ...fetchOptions, headers: retryHeaders });
      if (!retry.ok) throw new ApiError(await retry.json(), retry.status);
      return retry.json();
    }
    // Could not refresh — force logout
    if (typeof window !== "undefined") {
      localStorage.removeItem("aayug-auth");
      window.location.href = "/auth/login";
    }
    throw new ApiError({ message: "Session expired" }, 401);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(body, res.status);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const raw = localStorage.getItem("aayug-auth") ?? "{}";
    const store = JSON.parse(raw);
    const refreshToken = store?.state?.refreshToken;
    if (!refreshToken) return false;

    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;

    const { data } = await res.json();
    setToken(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  constructor(
    public readonly body: { message?: string; errors?: unknown },
    public readonly status: number
  ) {
    super(body?.message ?? "API Error");
  }
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authApi = {
  sendOtp: (phone: string) =>
    apiFetch<{ success: boolean; message: string }>("/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
      skipAuth: true
    }),

  verifyOtp: (phone: string, code: string) =>
    apiFetch<{ data: { isNewUser: boolean; accessToken?: string; refreshToken?: string; user?: any; phone?: string } }>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
      skipAuth: true
    }),

  completeOtpProfile: (data: { phone: string; firstName: string; lastName: string; email: string }) =>
    apiFetch<{ data: { accessToken: string; refreshToken: string; user: any } }>("/auth/otp/complete-profile", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true
    }),

  register: (data: {
    firstName: string; lastName: string; email: string;
    password: string; confirmPassword: string; phone?: string;
  }) => apiFetch<{ data: { id: string; email: string; firstName: string; lastName: string } }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(data), skipAuth: true }
  ),

  login: (email: string, password: string) =>
    apiFetch<{ data: { accessToken: string; refreshToken: string; user: { id: string; email: string; firstName: string; lastName: string; role: string; phone?: string } } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }), skipAuth: true }
    ),

  logout: (refreshToken: string) =>
    apiFetch("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }),

  forgotPassword: (email: string) =>
    apiFetch("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }), skipAuth: true }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    apiFetch("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password, confirmPassword }), skipAuth: true }),

  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    apiFetch("/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword, confirmPassword }) }),

  verifyEmail: (token: string) =>
    apiFetch(`/auth/verify-email?token=${token}`, { skipAuth: true }),
};

// ─── Products API ─────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{ data: unknown[]; meta: unknown }>(`/products${qs}`, { skipAuth: true });
  },

  getBySlug: (slug: string) =>
    apiFetch<{ data: unknown }>(`/products/slug/${slug}`, { skipAuth: true }),

  getById: (id: string) =>
    apiFetch<{ data: unknown }>(`/products/${id}`, { skipAuth: true }),
};

// ─── Categories API ───────────────────────────────────────────────────────────

export const categoriesApi = {
  getAll: () =>
    apiFetch<{ data: unknown[] }>("/categories", { skipAuth: true }),
};

// ─── Cart API ────────────────────────────────────────────────────────────────

export const cartApi = {
  get: () => apiFetch<{ data: unknown }>("/cart"),

  add: (productId: string, quantity: number) =>
    apiFetch("/cart", { method: "POST", body: JSON.stringify({ productId, quantity }) }),

  update: (productId: string, quantity: number) =>
    apiFetch(`/cart/${productId}`, { method: "PATCH", body: JSON.stringify({ quantity }) }),

  remove: (productId: string) =>
    apiFetch(`/cart/${productId}`, { method: "DELETE" }),

  clear: () => apiFetch("/cart", { method: "DELETE" }),
};

// ─── Orders API ───────────────────────────────────────────────────────────────

export const ordersApi = {
  checkout: (payload: {
    addressId: string; paymentMethod: string;
    paymentProvider?: string; couponCode?: string; notes?: string;
  }) => apiFetch("/orders/checkout", { method: "POST", body: JSON.stringify(payload) }),

  verifyPayment: (data: {
    orderId: string; providerOrderId: string;
    providerPaymentId: string; providerSignature?: string;
  }) => apiFetch("/orders/verify-payment", { method: "POST", body: JSON.stringify(data) }),

  getMyOrders: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{ data: unknown[]; meta: unknown }>(`/orders/my-orders${qs}`);
  },

  getMyOrder: (id: string) =>
    apiFetch<{ data: unknown }>(`/orders/my-orders/${id}`),

  cancel: (id: string, reason: string) =>
    apiFetch(`/orders/my-orders/${id}/cancel`, { method: "PATCH", body: JSON.stringify({ reason }) }),
};

// ─── User API ─────────────────────────────────────────────────────────────────

export const userApi = {
  getProfile: () => apiFetch<{ data: unknown }>("/users/me"),

  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) =>
    apiFetch("/users/me", { method: "PATCH", body: JSON.stringify(data) }),

  getAddresses: () => apiFetch<{ data: unknown[] }>("/users/me/addresses"),

  addAddress: (data: unknown) =>
    apiFetch("/users/me/addresses", { method: "POST", body: JSON.stringify(data) }),

  updateAddress: (id: string, data: unknown) =>
    apiFetch(`/users/me/addresses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteAddress: (id: string) =>
    apiFetch(`/users/me/addresses/${id}`, { method: "DELETE" }),

  setDefaultAddress: (id: string) =>
    apiFetch(`/users/me/addresses/${id}/default`, { method: "PATCH" }),
};

// ─── Wishlist API ─────────────────────────────────────────────────────────────

export const wishlistApi = {
  get: () => apiFetch<{ data: unknown[] }>("/wishlist"),
  add: (productId: string) => apiFetch(`/wishlist/${productId}`, { method: "POST" }),
  remove: (productId: string) => apiFetch(`/wishlist/${productId}`, { method: "DELETE" }),
};

// ─── Coupons API ──────────────────────────────────────────────────────────────

export const couponsApi = {
  validate: (code: string, cartTotal: number) =>
    apiFetch("/coupons/validate", { method: "POST", body: JSON.stringify({ code, cartTotal }) }),
};

// ─── Reviews API ──────────────────────────────────────────────────────────────

export const reviewsApi = {
  getProductReviews: (productId: string, page = 1) =>
    apiFetch<{ data: unknown[] }>(`/products/${productId}/reviews?page=${page}`, { skipAuth: true }),

  create: (productId: string, data: { rating: number; title?: string; body?: string }) =>
    apiFetch(`/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(data) }),

  delete: (id: string) => apiFetch(`/reviews/${id}`, { method: "DELETE" }),
};
