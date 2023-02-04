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
    email: Type.String({ format: 'email' }),
    name: Type.String({ minLength: 4 }),
    password: Type.String({ minLength: 8 }),
  }),
  response: {
    200: Type.Object({
      data: userSchema,
    }),
  },
};

export const loginSchema = {
  body: Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({
        token: Type.String(),
      }),
    }),
  },
};
