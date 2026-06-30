import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.enum(['UPI', 'CARD', 'COD', 'RAZORPAY', 'PAYU', 'CASHFREE']),
    paymentProvider: z.enum(['RAZORPAY', 'PAYU', 'CASHFREE', 'COD', 'INTERNAL']).optional(),
    couponCode: z.string().toUpperCase().optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    providerOrderId: z.string(),
    providerPaymentId: z.string(),
    providerSignature: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z.enum([
      'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED',
      'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED',
    ]),
    trackingNumber: z.string().optional(),
    cancellationReason: z.string().optional(),
  }),
});

export const cancelOrderSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    reason: z.string().min(5).max(500),
  }),
});
