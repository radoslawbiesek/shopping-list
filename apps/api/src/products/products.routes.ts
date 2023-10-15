import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { deleteParamsSchema, deleteReplySchema } from '../common/common.schema';
import {
  createProductHandler,
  deleteProductHandler,
  getAllProductsHandler,
} from './products.handlers';
import {
  createProductRequestBodySchema,
  productReplySchema,
  getAllProductsReplySchema,
} from './products.schema';

const productsRoutes: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<TypeBoxTypeProvider>()
    .addHook('onRequest', app.authenticate)
    .get('/products', {
      schema: {
        response: {
          200: getAllProductsReplySchema,
        },
      },
      handler: getAllProductsHandler,
    })
    .post('/products', {
      schema: {
        body: createProductRequestBodySchema,
        response: {
          200: productReplySchema,
        },
      },
      handler: createProductHandler,
    })
    .delete('/products/:id', {
      schema: {
        params: deleteParamsSchema,
        response: {
          204: deleteReplySchema,
        },
      },
      handler: deleteProductHandler,
    });
};

export default productsRoutes;
