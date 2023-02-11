import * as dotenv from 'dotenv';

process.env['NODE_ENV'] = process.env['NODE_ENV'] || 'development';

dotenv.config({ path: `.env.${process.env['NODE_ENV']}` });

export const config = {
  nodeEnv: process.env['NODE_ENV'],
  port: process.env['PORT'] ? parseInt(process.env['PORT']) : 3000,
  db: {
    url: process.env['DATABASE_URL'],
  },
  jwt: {
    secret: process.env['JWT_SECRET'] || 'secret',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '8h',
  },
  bcrypt: {
    saltOrRounds: process.env['BCRYPT_SALT_OR_ROUNDS'] || 10,
  },
  version: process.env['VERSION'] || '0.0.0',
} as const;
