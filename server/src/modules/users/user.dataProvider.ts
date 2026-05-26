import { PostgresDb } from '@fastify/postgres';
import { type CreateUserRequestParams, type UserDTO } from './types';

class UserDataProvider {
  db: PostgresDb;

  constructor(db: PostgresDb) {
    this.db = db;
  }

  async fetchAll(): Promise<UserDTO[]> {
    const result = await this.db.query<UserDTO>(`
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

  async create(user: CreateUserRequestParams): Promise<UserDTO> {
    const result = await this.db.query<UserDTO>(
      `
            INSERT INTO workers (first_name, last_name, patronymic)
            VALUES ($1, $2, $3)
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                patronymic,
                concat_ws(' ', last_name, first_name, patronymic) AS "fullName";
        `,
      [user.firstName, user.lastName, user.patronymic || ''],
    );

    return result.rows[0];
  }
}

export default UserDataProvider;
