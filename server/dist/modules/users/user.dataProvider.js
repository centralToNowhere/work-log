"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDataProvider {
    constructor(db) {
        this.db = db;
    }
    async fetchAll() {
        const result = await this.db.query(`
            SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                patronymic,
                concat_ws(' ', last_name, first_name, patronymic) AS "fullName"
            FROM workers
            ORDER BY last_name, first_name, patronymic, id;
        `);
        return result.rows;
    }
    async create(user) {
        const result = await this.db.query(`
            INSERT INTO workers (first_name, last_name, patronymic)
            VALUES ($1, $2, $3)
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                patronymic,
                concat_ws(' ', last_name, first_name, patronymic) AS "fullName";
        `, [user.firstName, user.lastName, user.patronymic || '']);
        return result.rows[0];
    }
}
exports.default = UserDataProvider;
