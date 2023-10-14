import { Static, Type } from '@sinclair/typebox';

export const listReplySchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  createdBy: Type.Integer(),
});

export const createListRequestBodySchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 25 }),
});

export const getAllListsReplySchema = Type.Array(listReplySchema);

export type CreateListRequestBody = Static<typeof createListRequestBodySchema>;
export type ListReply = Static<typeof listReplySchema>;
export type GetAllListsReply = Static<typeof getAllListsReplySchema>;
