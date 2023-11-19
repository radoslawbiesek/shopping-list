import FP from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { config } from '../config';

export const connection = postgres(config.db.url);
export const databaseClient = drizzle(connection);

declare module 'fastify' {
  interface FastifyInstance {
    database: typeof databaseClient;
  }
}

const database: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onClose', async () => await connection.end());
  fastify.decorate('database', databaseClient);
};

export default FP(database);
