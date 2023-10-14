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
  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'POST',
    onRequest: [app.authenticate],
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
    onRequest: [app.authenticate],
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
    onRequest: [app.authenticate],
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
