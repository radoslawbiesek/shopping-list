import { Type, Static } from '@sinclair/typebox';

export const userReplySchema = Type.Object({
  email: Type.String(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  id: Type.Number(),
});

export const registerRequestBodySchema = Type.Object({
  email: Type.String({ format: 'email', maxLength: 50 }),
  name: Type.String({ minLength: 4, maxLength: 25 }),
  password: Type.String({ minLength: 8, maxLength: 16 }),
});

export const loginRequestBodySchema = Type.Object({
  email: Type.String(),
  password: Type.String(),
});

export const loginReplySchema = Type.Object({
  token: Type.String(),
  user: userReplySchema,
});

export type UserReply = Static<typeof userReplySchema>;
export type RegisterRequestBody = Static<typeof registerRequestBodySchema>;
export type LoginRequestBody = Static<typeof loginRequestBodySchema>;
export type LoginReply = Static<typeof loginReplySchema>;
