import { z } from 'zod';

import {
  allCategoriesReplySchema,
  categoryReplySchema,
  createCategoryRequestBodySchema,
} from './categories.schema';

export type CategoryReply = z.infer<typeof categoryReplySchema>;
export type AllCategoriesReply = z.infer<typeof allCategoriesReplySchema>;
export type CreateCategoryRequestBody = z.infer<typeof createCategoryRequestBodySchema>;
