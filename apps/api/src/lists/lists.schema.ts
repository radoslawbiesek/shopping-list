import { Type } from '@sinclair/typebox';

const listSchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  createdBy: Type.Integer(),
});

export const createListSchema = {
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 25 }),
  }),
  response: {
    200: listSchema,
  },
};

export const getAllListsSchema = {
  response: {
    200: Type.Array(listSchema),
  },
};
