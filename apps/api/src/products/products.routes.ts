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
    .addHook('onRequest', app.authenticate)
    .get('/', {
      schema: {
        response: {
          200: getAllProductsReplySchema,
        },
      },
      handler: getAllProductsHandler,
    })
    .post('/', {
      schema: {
        body: createProductRequestBodySchema,
        response: {
          200: productReplySchema,
        },
      },
      handler: createProductHandler,
    })
    .delete('/:id', {
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
