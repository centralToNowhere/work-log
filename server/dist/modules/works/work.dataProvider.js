"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorkDataProvider {
    constructor(db) {
        this.db = db;
    }
    async fetchAll(sort, filter) {
        const sortByDateDirection = sort.byDate === 'asc' ? 'ASC' : 'DESC';
        const filterByDate = filter.byDate || null;
        const workList = await this.db.query(`
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
    async create(work) {
        const result = await this.db.query(`
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
    async delete(id) {
        const result = await this.db.query(`DELETE FROM works WHERE id = $1 `, [id]);
        return result.rowCount > 0;
    }
}
exports.default = WorkDataProvider;
