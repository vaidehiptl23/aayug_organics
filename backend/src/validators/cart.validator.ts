import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(50).default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({ productId: z.string().uuid() }),
  body: z.object({
    quantity: z.number().int().min(1).max(50),
  }),
});

export const applyCouponSchema = z.object({
  body: z.object({
    couponCode: z.string().min(1).toUpperCase().trim(),
  }),
});
