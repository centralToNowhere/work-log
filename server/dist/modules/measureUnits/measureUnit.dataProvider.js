"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MeasureUnitDataProvider {
    constructor(db) {
        this.db = db;
    }
    async fetchAll() {
        const result = await this.db.query(`
            SELECT
                id,
                code,
                value_singular_ru AS "valueSingularRu"
            FROM measure_units
            ORDER BY id;
        `);
        return result.rows;
    }
    async create(measureUnit) {
        const result = await this.db.query(`
            INSERT INTO measure_units (code, value_singular_ru)
            VALUES ($1, $2)
            ON CONFLICT (code) DO UPDATE SET value_singular_ru = EXCLUDED.value_singular_ru
            RETURNING
                id,
                code,
                value_singular_ru AS "valueSingularRu";
        `, [measureUnit.code, measureUnit.valueSingularRu]);
        return result.rows[0];
    }
}
exports.default = MeasureUnitDataProvider;
