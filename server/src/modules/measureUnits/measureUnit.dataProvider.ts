import { PostgresDb } from '@fastify/postgres';
import { type CreateMeasureUnitRequestParams, type MeasureUnitDTO } from './types';

class MeasureUnitDataProvider {
  db: PostgresDb;

  constructor(db: PostgresDb) {
    this.db = db;
  }

  async fetchAll(): Promise<MeasureUnitDTO[]> {
    const result = await this.db.query<MeasureUnitDTO>(`
            SELECT
                id,
                code,
                value_singular_ru AS "valueSingularRu"
            FROM measure_units
            ORDER BY id;
        `);

    return result.rows;
  }

  async create(measureUnit: CreateMeasureUnitRequestParams): Promise<MeasureUnitDTO> {
    const result = await this.db.query<MeasureUnitDTO>(
      `
            INSERT INTO measure_units (code, value_singular_ru)
            VALUES ($1, $2)
            ON CONFLICT (code) DO UPDATE SET value_singular_ru = EXCLUDED.value_singular_ru
            RETURNING
                id,
                code,
                value_singular_ru AS "valueSingularRu";
        `,
      [measureUnit.code, measureUnit.valueSingularRu],
    );

    return result.rows[0];
  }
}

export default MeasureUnitDataProvider;
