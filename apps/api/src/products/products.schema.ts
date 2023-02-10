import { Type } from '@sinclair/typebox';

const productSchema = Type.Object({
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

export const createProductSchema = {
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 25 }),
    description: Type.Optional(Type.String({ maxLength: 120 })),
    image: Type.Optional(Type.String({ format: 'uri' })),
    categoryId: Type.Integer(),
  }),
  response: {
    200: productSchema,
  },
};

export const getAllProductsSchema = {
  response: {
    200: Type.Array(productSchema),
  },
};
