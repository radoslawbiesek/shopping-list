import { PrismaClient } from '@prisma/client';
import { FastifyPluginAsync } from 'fastify';
import FP from 'fastify-plugin';

const db: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();

  fastify.addHook('onClose', () => prisma.$disconnect());
  fastify.decorate('db', prisma);
};

export default FP(db);
