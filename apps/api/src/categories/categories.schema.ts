import { Type } from '@sinclair/typebox';

const categorySchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  parentId: Type.Union([Type.Null(), Type.Integer()]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const createCategorySchema = {
  body: Type.Object({
    name: Type.String({ minLength: 4, maxLength: 25 }),
    parentId: Type.Optional(Type.Integer()),
  }),
  response: {
    200: categorySchema,
  },
};

export const getAllCategoriesSchema = {
  response: {
    200: Type.Array(categorySchema),
  },
};
