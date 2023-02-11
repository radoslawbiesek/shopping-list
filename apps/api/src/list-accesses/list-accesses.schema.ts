import { Type } from '@sinclair/typebox';

const listAccessSchema = Type.Object({
  id: Type.Integer(),
  listId: Type.Integer(),
  userId: Type.Integer(),
  access: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

const params = Type.Object({
  listId: Type.Integer(),
});

export const createListAccessSchema = {
  params,
  body: Type.Object({
    userId: Type.Integer(),
  }),
  response: {
    200: listAccessSchema,
  },
};

export const getAllListAccessesSchema = {
  params,
  response: {
    200: Type.Array(listAccessSchema),
  },
};

export const deleteListAccessSchema = {
  params: Type.Object({
    listId: Type.Integer(),
    id: Type.Integer(),
  }),
  response: {
    204: Type.Never(),
  },
};
