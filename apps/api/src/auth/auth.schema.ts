import { Type, Static } from '@sinclair/typebox';

const userSchema = Type.Object({
  email: Type.String(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  id: Type.Number(),
});

export type UserSchema = Static<typeof userSchema>;

export const registerSchema = {
  body: Type.Object({
    email: Type.String({ format: 'email', maxLength: 50 }),
    name: Type.String({ minLength: 4, maxLength: 25 }),
    password: Type.String({ minLength: 8, maxLength: 16 }),
  }),
  response: {
    200: userSchema,
  },
};

export const loginSchema = {
  body: Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
  response: {
    200: Type.Object({
      token: Type.String(),
      user: userSchema,
    }),
  },
};

export const meSchema = {
  response: {
    200: userSchema,
  },
};
