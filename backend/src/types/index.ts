import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

// Extend Express Request properly so all req.body/params/query/file/files work
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ProductFilters extends PaginationQuery {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popularity';
  status?: string;
  brand?: string;
  inStock?: string;
}

export interface OrderFilters extends PaginationQuery {
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CheckoutPayload {
  addressId: string;
  paymentMethod: string;
  couponCode?: string;
  paymentProvider?: string;
  notes?: string;
}

export interface PaymentVerificationPayload {
  orderId: string;
  providerOrderId: string;
  providerPaymentId: string;
  providerSignature?: string;
}

export interface CartTotals {
  subtotal: number;
  discountAmount: number;
  shippingCharge: number;
  taxAmount: number;
  grandTotal: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: unknown[];
  topProducts: unknown[];
  revenueByMonth: unknown[];
}
