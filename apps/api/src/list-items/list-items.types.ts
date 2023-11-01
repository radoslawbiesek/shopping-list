import { z } from 'zod';

import {
  listItemParamsSchema,
  createListItemRequestBodySchema,
  listItemReplySchema,
  getAllListItemsReplySchema,
  deleteListItemParamsSchema,
  updateListItemParamsSchema,
  updateListItemRequestBodySchema,
} from './list-items.schema';

export type ListItemParams = z.infer<typeof listItemParamsSchema>;
export type CreateListItemRequestBody = z.infer<typeof createListItemRequestBodySchema>;
export type ListItemReply = z.infer<typeof listItemReplySchema>;
export type GetAllListItemsReply = z.infer<typeof getAllListItemsReplySchema>;
export type DeleteListItemParams = z.infer<typeof deleteListItemParamsSchema>;
export type UpdateListItemParams = z.infer<typeof updateListItemParamsSchema>;
export type UpdateListItemRequestBody = z.infer<typeof updateListItemRequestBodySchema>;
