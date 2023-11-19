import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { databaseClient, connection } from './database';

(async function () {
  await migrate(databaseClient, { migrationsFolder: 'drizzle' });

  await connection.end();
})();
