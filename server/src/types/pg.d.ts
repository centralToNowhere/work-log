declare module 'pg' {
    export type QueryResult<T = unknown> = {
        rowCount: number | null;
        rows: T[];
    };

    export class Client {
        constructor(config: {
            user: string;
            password: string;
            host: string;
            port: number;
            database: string;
        });

        connect(): Promise<void>;
        query<T = unknown>(query: string, values?: unknown[]): Promise<QueryResult<T>>;
        end(): Promise<void>;
    }
}
