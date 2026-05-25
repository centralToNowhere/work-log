"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const promises_1 = require("node:fs/promises");
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_NAME || process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    maintenanceDb: process.env.POSTGRES_MAINTENANCE_DB || 'postgres',
};
if (!config.user || !config.password || !config.dbName || !config.host || !config.port) {
    throw new Error('Database config is not set');
}
const dbConfig = config;
function quoteIdentifier(value) {
    return `"${value.replace(/"/g, '""')}"`;
}
async function createDatabaseIfNeeded() {
    const client = new pg_1.Client({
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: Number(dbConfig.port),
        database: dbConfig.maintenanceDb,
    });
    await client.connect();
    try {
        const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbConfig.dbName]);
        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE ${quoteIdentifier(dbConfig.dbName)}`);
        }
    }
    finally {
        await client.end();
    }
}
async function runMigrations() {
    const client = new pg_1.Client({
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: Number(dbConfig.port),
        database: dbConfig.dbName,
    });
    const migration = await (0, promises_1.readFile)((0, node_path_1.join)(process.cwd(), 'db/migrations/001_init.sql'), 'utf8');
    await client.connect();
    try {
        await client.query(migration);
    }
    finally {
        await client.end();
    }
}
async function main() {
    await createDatabaseIfNeeded();
    await runMigrations();
    console.log('Database migrations completed');
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
