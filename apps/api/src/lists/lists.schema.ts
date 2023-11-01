import { z } from 'zod';

export const listReplySchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.number(),
});

export const createListRequestBodySchema = z.object({
  name: z
    .string({
      required_error: 'Nazwa jest wymagana',
      invalid_type_error: 'Nazwa musi być ciągiem znaków',
    })
    .min(1, { message: 'Nazwa jest wymagana' })
    .max(25, { message: 'Nazwa musi mieć mniej niż 25 znaków' }),
});

export const getAllListsReplySchema = z.array(listReplySchema);
