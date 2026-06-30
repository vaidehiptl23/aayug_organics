import { z } from 'zod';

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(20).toUpperCase().trim(),
    type: z.enum(['PERCENTAGE', 'FIXED']),
    value: z.number().positive(),
    minOrderAmount: z.number().positive().optional(),
    maxDiscountAmount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    perUserLimit: z.number().int().min(1).default(1),
    isActive: z.boolean().default(true),
    expiresAt: z.string().datetime().optional(),
    applicableUserId: z.string().uuid().optional(),
  }),
});

export const updateCouponSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    value: z.number().positive().optional(),
    minOrderAmount: z.number().positive().optional(),
    maxDiscountAmount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    perUserLimit: z.number().int().min(1).optional(),
    isActive: z.boolean().optional(),
    expiresAt: z.string().datetime().optional(),
  }),
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1).toUpperCase().trim(),
    cartTotal: z.number().positive(),
  }),
});
