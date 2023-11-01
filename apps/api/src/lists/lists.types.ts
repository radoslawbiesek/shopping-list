import { z } from 'zod';

import {
  createListRequestBodySchema,
  getAllListsReplySchema,
  listReplySchema,
} from './lists.schema';

export type CreateListRequestBody = z.infer<typeof createListRequestBodySchema>;
export type ListReply = z.infer<typeof listReplySchema>;
export type GetAllListsReply = z.infer<typeof getAllListsReplySchema>;
