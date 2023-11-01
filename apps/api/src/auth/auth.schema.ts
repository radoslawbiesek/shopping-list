import { z } from 'zod';

export const userReplySchema = z.object({
  email: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  id: z.number(),
});

export const registerRequestBodySchema = z.object({
  email: z
    .string({ required_error: 'Email jest wymagany' })
    .email({ message: 'Email jest nieprawidłowy' })
    .max(50, { message: 'Email musi mieć mniej niż 50 znaków' }),
  name: z
    .string({
      required_error: 'Nazwa jest wymagana',
      invalid_type_error: 'Nazwa musi być ciągiem znaków',
    })
    .min(4, { message: 'Nazwa musi mieć więcej niż 4 znaki' })
    .max(25, { message: 'Nazwa musi mieć mniej niż 25 znaków' }),
  password: z
    .string({
      required_error: 'Hasło jest wymagane',
      invalid_type_error: 'Hasło musi być ciągiem znaków',
    })
    .min(8, { message: 'Hasło musi mieć więcej niż 8 znaków' })
    .max(16, { message: 'Hasło musi mieć mniej niż 16 znaków' }),
});

export const loginRequestBodySchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email jest wymagany' })
    .email({ message: 'Email jest nieprawidłowy' }),
  password: z.string().min(1, { message: 'Hasło jest wymagane' }),
});

export const loginReplySchema = z.object({
  token: z.string(),
  user: userReplySchema,
});
