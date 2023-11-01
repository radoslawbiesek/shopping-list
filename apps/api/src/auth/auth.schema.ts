import { z } from 'zod';

export const userReplySchema = z.object({
  email: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  id: z.number().int(),
});

export const registerRequestBodySchema = z.object({
  email: z.string().email().max(50),
  name: z.string().min(4).max(25),
  password: z.string().min(8).max(16),
});

export const loginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginReplySchema = z.object({
  token: z.string(),
  user: userReplySchema,
});
