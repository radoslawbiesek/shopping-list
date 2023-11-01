import { z } from 'zod';

export const listAccessReplySchema = z.object({
  id: z.number().int(),
  listId: z.number().int(),
  userId: z.number().int(),
  access: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const getAllListAccessesReplySchema = z.array(listAccessReplySchema);

export const listAccessParamsSchema = z.object({
  listId: z.number().int(),
});

export const createListAccessRequestBodySchema = z.object({
  userId: z.number().int(),
});

export const deleteListAccessParamsSchema = z.object({
  listId: z.number().int(),
  id: z.number().int(),
});
