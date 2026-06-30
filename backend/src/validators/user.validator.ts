import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(50).trim().optional(),
    lastName: z.string().min(2).max(50).trim().optional(),
    phone: z.string().regex(/^[6-9][0-9]{9}$/).optional(),
  }),
});

export const addAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100).trim(),
    phone: z.string().regex(/^[6-9][0-9]{9}$/, 'Invalid Indian phone number'),
    addressLine1: z.string().min(5).max(200).trim(),
    addressLine2: z.string().max(200).trim().optional(),
    city: z.string().min(2).max(100).trim(),
    state: z.string().min(2).max(100).trim(),
    postalCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid PIN code'),
    country: z.string().default('India'),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    fullName: z.string().min(2).max(100).trim().optional(),
    phone: z.string().regex(/^[6-9][0-9]{9}$/).optional(),
    addressLine1: z.string().min(5).max(200).trim().optional(),
    addressLine2: z.string().max(200).trim().optional(),
    city: z.string().min(2).max(100).trim().optional(),
    state: z.string().min(2).max(100).trim().optional(),
    postalCode: z.string().regex(/^[1-9][0-9]{5}$/).optional(),
    country: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});
