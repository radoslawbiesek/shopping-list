import { Static, Type } from '@sinclair/typebox';

export const deleteParamsSchema = Type.Object({
  id: Type.Integer(),
});

export const deleteReplySchema = Type.Never();

export const deleteSchema = {
  params: deleteParamsSchema,
  response: {
    204: deleteReplySchema,
  },
};

export type DeleteParams = Static<typeof deleteParamsSchema>;
export type DeleteReply = Static<typeof deleteReplySchema>;
