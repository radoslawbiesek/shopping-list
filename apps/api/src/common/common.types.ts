import { z } from 'zod';

import { deleteParamsSchema, deleteReplySchema } from './common.schema';

export type DeleteParams = z.infer<typeof deleteParamsSchema>;
export type DeleteReply = z.infer<typeof deleteReplySchema>;
