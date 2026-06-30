import { z } from 'zod';

export const createReviewSchema = z.object({
  params: z.object({ productId: z.string().uuid() }),
  body: z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().max(100).trim().optional(),
    body: z.string().max(2000).trim().optional(),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().max(100).trim().optional(),
    body: z.string().max(2000).trim().optional(),
  }),
});

export const moderateReviewSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
  }),
});
