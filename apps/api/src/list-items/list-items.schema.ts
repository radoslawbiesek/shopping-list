import { z } from 'zod';

export const listItemReplySchema = z.object({
  id: z.number().int(),
  listId: z.number().int(),
  productId: z.number().int(),
  isChecked: z.boolean(),
  isPriority: z.boolean(),
  amount: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.number().int(),
});

export const getAllListItemsReplySchema = z.array(listItemReplySchema);

export const listItemParamsSchema = z.object({
  listId: z.coerce.number().int(),
});

export const createListItemRequestBodySchema = z.object({
  productId: z.number().int(),
  isChecked: z.boolean().default(false),
  isPriority: z.boolean().default(false),
  amount: z.number().int().min(0).default(1),
});

export const deleteListItemParamsSchema = z.object({
  listId: z.coerce.number().int(),
  id: z.coerce.number().int(),
});

export const updateListItemParamsSchema = deleteListItemParamsSchema;

export const updateListItemRequestBodySchema = z.object({
  isChecked: z.optional(z.boolean()),
  isPriority: z.optional(z.boolean()),
  amount: z.optional(z.number().int().min(0)),
});
