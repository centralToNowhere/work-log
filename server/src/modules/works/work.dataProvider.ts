import { PostgresDb } from "@fastify/postgres";
import {
    type CreateWorkRequestParams,
    type GetWorksSortOrder,
    type GetWorksFilter,
    type WorkDTO
} from './types';

class WorkDataProvider {
    db: PostgresDb;

    constructor(db: PostgresDb) {
        this.db = db;
    }

    async fetchAll(sort: GetWorksSortOrder, filter: GetWorksFilter): Promise<WorkDTO[]> {
        const sortByDateDirection = sort.byDate === 'asc' ? 'ASC' : 'DESC';
        const filterByDate = filter.byDate || null;

        const workList = await this.db.query<WorkDTO>(`
            SELECT
                w.id,
                w.title,
                w.description,
                w.amount,
                mu.code AS "measureUnit",
                wr.id AS "workerId",
                concat_ws(' ', wr.last_name, wr.first_name, wr.patronymic) AS "workerFullName",
                w.created_at
            FROM works w
            JOIN measure_units mu ON mu.id = w.measure_unit
            JOIN workers wr ON wr.id = w.worker
            WHERE ($1::date IS NULL OR w.created_at::date = $1::date)
            ORDER BY w.created_at ${sortByDateDirection};
        `, [filterByDate]);

        return workList.rows;
    }

    async create(work: CreateWorkRequestParams): Promise<WorkDTO> {
        const result = await this.db.query<WorkDTO>(`
            WITH inserted_work AS (
                INSERT INTO works (title, description, amount, measure_unit, worker)
                SELECT
                    $1,
                    $2,
                    $3,
                    mu.id,
                    $4
                FROM measure_units mu
                WHERE mu.code = $5
                RETURNING id, title, description, amount, measure_unit, worker, created_at
            )
            SELECT
                iw.id,
                iw.title,
                iw.description,
                iw.amount,
                mu.code AS "measureUnit",
                wr.id AS "workerId",
                concat_ws(' ', wr.last_name, wr.first_name, wr.patronymic) AS "workerFullName",
                iw.created_at
            FROM inserted_work iw
            JOIN measure_units mu ON mu.id = iw.measure_unit
            JOIN workers wr ON wr.id = iw.worker;
        `, [
            work.title,
            work.description || null,
            work.amount,
            work.workerId,
            work.measureUnit,
        ]);

        return result.rows[0];
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db.query(
            `DELETE FROM works WHERE id = $1 `,
            [id]
        );

        return result.rowCount > 0;
    }
}

export default WorkDataProvider;
