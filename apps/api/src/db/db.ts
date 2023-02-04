import { PrismaClient } from '@prisma/client';
import { FastifyPluginAsync } from 'fastify';
import FP from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient;
  }
}

const db: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();

  fastify.addHook('onClose', () => prisma.$disconnect());
  fastify.decorate('db', prisma);
};

const dbPlugin = FP(db);

export default dbPlugin;
