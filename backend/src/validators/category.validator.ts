import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    description: z.string().max(1000).optional(),
    parentId: z.string().uuid().optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    description: z.string().max(1000).optional(),
    parentId: z.string().uuid().nullable().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});
