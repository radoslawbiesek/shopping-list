import { z } from 'zod';

import {
  listAccessReplySchema,
  getAllListAccessesReplySchema,
  listAccessParamsSchema,
  createListAccessRequestBodySchema,
  deleteListAccessParamsSchema,
} from './list-access.schema';

export type ListAccessReply = z.infer<typeof listAccessReplySchema>;
export type GetAllListAccessesReply = z.infer<typeof getAllListAccessesReplySchema>;
export type ListAccessParams = z.infer<typeof listAccessParamsSchema>;
export type CreateListAccessRequestBody = z.infer<typeof createListAccessRequestBodySchema>;
export type DeleteListAccessParams = z.infer<typeof deleteListAccessParamsSchema>;
