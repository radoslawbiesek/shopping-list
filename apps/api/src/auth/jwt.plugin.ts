import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import FP from 'fastify-plugin';

import { getEnvVariable } from '../config/config';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => void;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import('@fastify/jwt'), {
    secret: getEnvVariable('JWT_SECRET'),
    sign: {
      expiresIn: getEnvVariable('JWT_EXPIRES_IN'),
    },
  });

  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
};

export default FP(jwtPlugin);
