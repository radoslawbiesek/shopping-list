import { Type } from '@sinclair/typebox';

const productSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  description: Type.String(),
  image: Type.String(),
  categoryId: Type.Number(),
  lastUsed: Type.Optional(Type.String({ format: 'date-time' })),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const createProductSchema = {
  body: Type.Object({
    name: Type.String({ minLength: 4, maxLength: 25 }),
    description: Type.Optional(Type.String({ maxLength: 120 })),
    image: Type.Optional(Type.String({ format: 'uri' })),
    categoryId: Type.Integer({}),
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
