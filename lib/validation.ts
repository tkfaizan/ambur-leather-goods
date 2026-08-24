import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(2, 'SKU is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  salePrice: z.number().positive().optional().nullable(),
  categoryId: z.number().positive('Category is required'),
  stockStatus: z.enum(['in_stock', 'out_of_stock', 'low_stock']),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  colors: z.array(z.object({ name: z.string(), hex: z.string().optional() })).default([]),
  sizes: z.array(z.string()).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  whatsappNumber: z.string().min(10, 'Valid WhatsApp number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode is required'),
  note: z.string().optional(),
});

export const settingsSchema = z.object({
  businessName: z.string().min(2),
  whatsappNumber: z.string().min(10),
  businessPhone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  instagramUrl: z.string().url().optional(),
  facebookUrl: z.string().url().optional(),
});
