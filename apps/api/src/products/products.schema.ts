import { z } from 'zod';

export const productReplySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  categoryId: z.number().int(),
  description: z.union([z.null(), z.string()]),
  image: z.union([z.null(), z.string()]),
  lastUsed: z.union([z.null(), z.string().datetime()]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.number().int(),
});

export const createProductRequestBodySchema = z.object({
  name: z.string().min(1).max(25),
  description: z.optional(z.string().max(120)),
  image: z.optional(z.string().url()),
  categoryId: z.number().int(),
});

export const getAllProductsReplySchema = z.array(productReplySchema);
