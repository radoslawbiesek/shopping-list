import { z } from 'zod';

import {
  createProductRequestBodySchema,
  getAllProductsReplySchema,
  productReplySchema,
} from './products.schema';

export type ProductReply = z.infer<typeof productReplySchema>;
export type CreateProductRequestBody = z.infer<typeof createProductRequestBodySchema>;
export type GetAllProductsReply = z.infer<typeof getAllProductsReplySchema>;
