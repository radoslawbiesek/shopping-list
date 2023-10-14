import { Static, Type } from '@sinclair/typebox';

export const listItemReplySchema = Type.Object({
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

export const getAllListItemsReplySchema = Type.Array(listItemReplySchema);

export const listItemParamsSchema = Type.Object({
  listId: Type.Integer(),
});

export const createListItemRequestBodySchema = Type.Object({
  productId: Type.Integer(),
  isChecked: Type.Boolean({ default: false }),
  isPriority: Type.Boolean({ default: false }),
  amount: Type.Integer({ minimum: 0, default: 1 }),
});

export const deleteListItemParamsSchema = Type.Object({
  listId: Type.Integer(),
  id: Type.Integer(),
});

export const updateListItemParamsSchema = deleteListItemParamsSchema;

export const updateListItemRequestBodySchema = Type.Object({
  isChecked: Type.Optional(Type.Boolean()),
  isPriority: Type.Optional(Type.Boolean()),
  amount: Type.Optional(Type.Integer({ minimum: 0 })),
});

export type ListItemParams = Static<typeof listItemParamsSchema>;
export type CreateListItemRequestBody = Static<typeof createListItemRequestBodySchema>;
export type ListItemReply = Static<typeof listItemReplySchema>;
export type GetAllListItemsReply = Static<typeof getAllListItemsReplySchema>;
export type DeleteListItemParams = Static<typeof deleteListItemParamsSchema>;
export type UpdateListItemParams = Static<typeof updateListItemParamsSchema>;
export type UpdateListItemRequestBody = Static<typeof updateListItemRequestBodySchema>;
