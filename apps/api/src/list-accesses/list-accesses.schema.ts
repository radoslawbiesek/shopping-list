import { Static, Type } from '@sinclair/typebox';

export const listAccessReplySchema = Type.Object({
  id: Type.Integer(),
  listId: Type.Integer(),
  userId: Type.Integer(),
  access: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const getAllListAccessesReplySchema = Type.Array(listAccessReplySchema);

export const listAccessParamsSchema = Type.Object({
  listId: Type.Integer(),
});

export const createListAccessRequestBodySchema = Type.Object({
  userId: Type.Integer(),
});

export const deleteListAccessParamsSchema = Type.Object({
  listId: Type.Integer(),
  id: Type.Integer(),
});

export type ListAccessReply = Static<typeof listAccessReplySchema>;
export type GetAllListAccessesReply = Static<typeof getAllListAccessesReplySchema>;
export type ListAccessParams = Static<typeof listAccessParamsSchema>;
export type CreateListAccessRequestBody = Static<typeof createListAccessRequestBodySchema>;
export type DeleteListAccessParams = Static<typeof deleteListAccessParamsSchema>;
