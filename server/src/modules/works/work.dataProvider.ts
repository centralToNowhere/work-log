import { PostgresDb } from '@fastify/postgres';
import {
  CreateWorkRequestParams,
  GetWorksSortOrder,
  GetWorksFilter,
  GetWorksPaginationInput,
  GetWorksResponse,
  WorkDTO,
} from './types';

class WorkDataProvider {
  db: PostgresDb;

  constructor(db: PostgresDb) {
    this.db = db;
  }

  async fetchAll(
    sort: GetWorksSortOrder,
    filter: GetWorksFilter,
    pagination: GetWorksPaginationInput,
  ): Promise<GetWorksResponse> {
    const sortByDateDirection = sort.byDate === 'asc' ? 'ASC' : 'DESC';
    const filterByDate = filter.byDate || null;

    if (
      !Number.isInteger(pagination.page) ||
      !Number.isInteger(pagination.pageSize) ||
      pagination.page < 1 ||
      pagination.pageSize < 1
    ) {
      throw new Error('Incorrect pagination params');
    }

    const limit = pagination.pageSize;
    const offset = (pagination.page - 1) * pagination.pageSize;

    const workList = await this.db.query<WorkDTO>(
      `
            SELECT
                w.id,
                w.title,
                w.description,
                w.amount,
                mu.code AS "measureUnit",
                mu.value_singular_ru AS "measureUnitValueSingularRu",
                wr.id AS "workerId",
                concat_ws(' ', wr.last_name, wr.first_name, wr.patronymic) AS "workerFullName",
                w.created_at
            FROM works w
            JOIN measure_units mu ON mu.id = w.measure_unit
            JOIN workers wr ON wr.id = w.worker
            WHERE ($1::date IS NULL OR w.created_at::date = $1::date)
            ORDER BY w.created_at ${sortByDateDirection}
            LIMIT $2
            OFFSET $3;
        `,
      [filterByDate, limit, offset],
    );

    const totalResult = await this.db.query<{ total: string }>(
      `
            SELECT COUNT(*)::text AS total
            FROM works w
            WHERE ($1::date IS NULL OR w.created_at::date = $1::date);
        `,
      [filterByDate],
    );

    return {
      data: workList.rows,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: Number(totalResult.rows[0]?.total || 0),
      },
    };
  }

  async create(work: CreateWorkRequestParams): Promise<WorkDTO> {
    const result = await this.db.query<WorkDTO>(
      `
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
                mu.value_singular_ru AS "measureUnitValueSingularRu",
                wr.id AS "workerId",
                concat_ws(' ', wr.last_name, wr.first_name, wr.patronymic) AS "workerFullName",
                iw.created_at
            FROM inserted_work iw
            JOIN measure_units mu ON mu.id = iw.measure_unit
            JOIN workers wr ON wr.id = iw.worker;
        `,
      [work.title, work.description || null, work.amount, work.workerId, work.measureUnit],
    );

    return result.rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query(`DELETE FROM works WHERE id = $1 `, [id]);

    return result.rowCount > 0;
  }
}

export default WorkDataProvider;
