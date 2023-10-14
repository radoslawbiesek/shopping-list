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
  app.addHook('onRequest', app.authenticate);

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'POST',
    schema: {
      body: createProductRequestBodySchema,
      response: {
        200: productReplySchema,
      },
    },
    handler: createProductHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'GET',
    schema: {
      response: {
        200: getAllProductsReplySchema,
      },
    },
    handler: getAllProductsHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:id',
    method: 'DELETE',
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
