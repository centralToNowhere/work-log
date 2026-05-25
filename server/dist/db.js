"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
async function dbConnector(fastify) {
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
    fastify.register(postgres_1.default, {
        connectionString: `postgres://${user}:${password}@${host}:${port}/${dbName}`
    });
    fastify.addHook('onReady', async () => {
        let client;
        try {
            client = await fastify.pg.connect();
            await client.query('SELECT 1');
        }
        catch (error) {
            fastify.log.error({ err: error }, 'Database connection failed');
            throw new Error('Database connection failed');
        }
        finally {
            client?.release();
        }
    });
}
exports.default = (0, fastify_plugin_1.default)(dbConnector);
