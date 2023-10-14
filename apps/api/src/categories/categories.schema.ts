import { Static, Type } from '@sinclair/typebox';

export const categoryReplySchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  parentId: Type.Union([Type.Null(), Type.Integer()]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  createdBy: Type.Number(),
});

export const allCategoriesReplySchema = Type.Array(categoryReplySchema);

export const createCategoryRequestBodySchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 25 }),
  parentId: Type.Optional(Type.Integer()),
});

export type CategoryReply = Static<typeof categoryReplySchema>;
export type AllCategoriesReply = Static<typeof allCategoriesReplySchema>;
export type CreateCategoryRequestBody = Static<typeof createCategoryRequestBodySchema>;
