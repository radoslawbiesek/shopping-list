import { Static, Type } from '@sinclair/typebox';

export const categorySchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  parentId: Type.Union([Type.Null(), Type.Integer()]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  createdBy: Type.Number(),
});

export const categoriesSchema = Type.Array(categorySchema);

export const createCategoryRequestBodySchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 25 }),
  parentId: Type.Optional(Type.Integer()),
});

export type Category = Static<typeof categorySchema>;
export type Categories = Static<typeof categoriesSchema>;
export type CreateCategoryRequestBody = Static<typeof createCategoryRequestBodySchema>;
