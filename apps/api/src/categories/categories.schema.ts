import { Static, Type } from '@sinclair/typebox';
import { z } from 'zod';

export const categoryReplySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  parentId: z.union([z.null(), z.number().int()]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.number().int(),
});

export const allCategoriesReplySchema = z.array(categoryReplySchema);

export const createCategoryRequestBodySchema = z.object({
  name: z.string().min(1).max(25),
  parentId: z.optional(z.number().int()),
});
