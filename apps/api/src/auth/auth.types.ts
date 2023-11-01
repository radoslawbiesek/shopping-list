import { z } from 'zod';

import {
  loginReplySchema,
  loginRequestBodySchema,
  registerRequestBodySchema,
  userReplySchema,
} from './auth.schema';

export type UserReply = z.infer<typeof userReplySchema>;
export type RegisterRequestBody = z.infer<typeof registerRequestBodySchema>;
export type LoginRequestBody = z.infer<typeof loginRequestBodySchema>;
export type LoginReply = z.infer<typeof loginReplySchema>;
