import { Type } from '@sinclair/typebox';

export const deleteSchema = {
  params: Type.Object({
    id: Type.Integer(),
  }),
  response: {
    204: Type.Never(),
  },
};
