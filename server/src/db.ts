import fp from 'fastify-plugin';
import FastifyPostgres from '@fastify/postgres';
import { FastifyInstance } from 'fastify';

async function dbConnector(fastify: FastifyInstance) {
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const dbName = process.env.POSTGRES_NAME || process.env.POSTGRES_DB;
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT;

  if (!user) {
    throw new Error('Database user is not set!');
  }

  if (!password) {
    throw new Error('Database password is not set!');
  }

  if (!dbName) {
    throw new Error('Database name is not set!');
  }

  if (!host) {
    throw new Error('Database host is not set!');
  }

  if (!port) {
    throw new Error('Database port is not set!');
  }

  fastify.register(FastifyPostgres, {
    connectionString: `postgres://${user}:${password}@${host}:${port}/${dbName}`,
  });

  fastify.addHook('onReady', async () => {
    let client;

    try {
      client = await fastify.pg.connect();
      await client.query('SELECT 1');
    } catch (error) {
      fastify.log.error({ err: error }, 'Database connection failed');
      const connectionError = new Error('Database connection failed');
      connectionError.cause = error;
      throw connectionError;
    } finally {
      client?.release();
    }
  });
}

export default fp(dbConnector);
