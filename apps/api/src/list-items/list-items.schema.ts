import { Type } from '@sinclair/typebox';

const listItemSchema = Type.Object({
  id: Type.Integer(),
  listId: Type.Integer(),
  productId: Type.Integer(),
  isChecked: Type.Boolean(),
  isPriority: Type.Boolean(),
  amount: Type.Integer(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  createdBy: Type.Integer(),
});

const baseParams = {
  params: Type.Object({
    listId: Type.Integer(),
  }),
};

export const createListItemSchema = {
  ...baseParams,
  body: Type.Object({
    productId: Type.Integer(),
    isChecked: Type.Boolean({ default: false }),
    isPriority: Type.Boolean({ default: false }),
    amount: Type.Integer({ minimum: 0, default: 1 }),
  }),
  response: {
    200: listItemSchema,
  },
};

export const deleteListItemSchema = {
  params: Type.Object({
    listId: Type.Integer(),
    id: Type.Integer(),
  }),
  response: {
    204: Type.Never(),
  },
};

export const updateListItemSchema = {
  params: Type.Object({
    listId: Type.Integer(),
    id: Type.Integer(),
  }),
  body: Type.Object({
    isChecked: Type.Optional(Type.Boolean()),
    isPriority: Type.Optional(Type.Boolean()),
    amount: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: listItemSchema,
  },
};

export const getAllListItemsSchema = {
  ...baseParams,
  response: {
    200: Type.Array(listItemSchema),
  },
};
