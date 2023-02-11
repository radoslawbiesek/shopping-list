import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import FP from 'fastify-plugin';

import { config } from '../config';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => void;
  }
}

type TokenPayload = {
  id: number;
  email: string;
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: TokenPayload;
    user: TokenPayload;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import('@fastify/jwt'), {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
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
