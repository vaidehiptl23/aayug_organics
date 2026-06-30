import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).trim(),
    description: z.string().max(5000).optional(),
    sku: z.string().min(3).max(50).trim().optional(),
    brand: z.string().max(100).optional(),
    categoryId: z.string().uuid(),
    price: z.number().positive(),
    discountPrice: z.number().positive().optional(),
    stockQuantity: z.number().int().min(0).default(0),
    isFeatured: z.boolean().optional(),
    badge: z.string().max(20).optional(),
    weight: z.number().positive().optional(),
    weightUnit: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).max(200).trim().optional(),
    description: z.string().max(5000).optional(),
    brand: z.string().max(100).optional(),
    categoryId: z.string().uuid().optional(),
    price: z.number().positive().optional(),
    discountPrice: z.number().positive().nullable().optional(),
    stockQuantity: z.number().int().min(0).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED']).optional(),
    isFeatured: z.boolean().optional(),
    badge: z.string().max(20).nullable().optional(),
    weight: z.number().positive().optional(),
    weightUnit: z.string().optional(),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating', 'popularity']).optional(),
    inStock: z.string().optional(),
    brand: z.string().optional(),
  }),
});

export const adjustInventorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    change: z.number().int(),
    reason: z.string().min(1).max(200),
  }),
});
