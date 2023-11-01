import { z } from 'zod';

export const deleteParamsSchema = z.object({
  id: z.coerce.number(),
});

export const deleteReplySchema = z.never();

export const deleteSchema = {
  params: deleteParamsSchema,
  response: {
    204: deleteReplySchema,
  },
};

export type DeleteParams = z.infer<typeof deleteParamsSchema>;
export type DeleteReply = z.infer<typeof deleteReplySchema>;
