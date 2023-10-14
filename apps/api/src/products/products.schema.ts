import { Static, Type } from '@sinclair/typebox';

export const productReplySchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  categoryId: Type.Number(),
  description: Type.Union([Type.Null(), Type.String()]),
  image: Type.Union([Type.Null(), Type.String()]),
  lastUsed: Type.Union([Type.Null(), Type.String({ format: 'date-time' })]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  createdBy: Type.Number(),
});

export const createProductRequestBodySchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 25 }),
  description: Type.Optional(Type.String({ maxLength: 120 })),
  image: Type.Optional(Type.String({ format: 'uri' })),
  categoryId: Type.Integer(),
});

export const getAllProductsReplySchema = Type.Array(productReplySchema);

export type ProductReply = Static<typeof productReplySchema>;
export type CreateProductRequestBody = Static<typeof createProductRequestBodySchema>;
export type GetAllProductsReply = Static<typeof getAllProductsReplySchema>;
