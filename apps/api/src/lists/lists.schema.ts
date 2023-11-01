import { z } from 'zod';

export const listReplySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.number().int(),
});

export const createListRequestBodySchema = z.object({
  name: z.string().min(1).max(25),
});

export const getAllListsReplySchema = z.array(listReplySchema);
