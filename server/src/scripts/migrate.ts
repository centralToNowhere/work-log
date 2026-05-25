import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

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

const dbConfig = config as {
    user: string;
    password: string;
    dbName: string;
    host: string;
    port: string;
    maintenanceDb: string;
};

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`;
}

async function createDatabaseIfNeeded() {
    const client = new Client({
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: Number(dbConfig.port),
        database: dbConfig.maintenanceDb,
    });

    await client.connect();

    try {
        const result = await client.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [dbConfig.dbName]
        );

        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE ${quoteIdentifier(dbConfig.dbName)}`);
        }
    } finally {
        await client.end();
    }
}

async function runMigrations() {
    const client = new Client({
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: Number(dbConfig.port),
        database: dbConfig.dbName,
    });

    const migration = await readFile(
        join(process.cwd(), 'db/migrations/001_init.sql'),
        'utf8'
    );

    await client.connect();

    try {
        await client.query(migration);
    } finally {
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
