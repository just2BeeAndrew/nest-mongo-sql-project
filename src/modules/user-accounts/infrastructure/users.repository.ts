import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async create(dto: CreateUserDto, t: any) {
    const user = await t.query(
      `
        WITH insert_user AS (
        INSERT
        INTO "Users" DEFAULT
        VALUES RETURNING id
          ), insert_account_data AS (
        INSERT
        INTO "AccountData" (id, login, password_hash, email, created_at, deleted_at)
        SELECT id, $1, $2, $3, NOW(), NULL
        FROM insert_user
          RETURNING id
          )
        INSERT
        INTO "EmailConfirmation" (id, confirmation_code, recovery_code, issued_at, expiration_date, is_confirmed)
        SELECT id, NULL, NULL, NOW(), NOW() + interval '1 day', false
        FROM insert_account_data
          RETURNING id;
      `,
      [dto.login, dto.passwordHash, dto.email],
    );
    return user[0].id;
  }

  async findUserById(id: string) {
    return await this.dataSource.query(
      `
        SELECT *
        FROM "Users" u
               JOIN "AccountData" a ON u.id = a.id
               LEFT JOIN "EmailConfirmation" e ON u.id = e.id
        WHERE a.id = $1
          AND a.deleted_at IS NULL`,
      [id],
    );
  }

  async isLoginTaken(login: string, manager?: any): Promise<boolean> {
    const runner = manager ?? this.dataSource;
    const result = await runner.query(
      'SELECT 1 FROM "AccountData" WHERE login = $1 AND deleted_at IS NULL LIMIT 1 ',
      [login],
    );
    return result.length > 0;
  }

  async isEmailTaken(email: string, manager?: any): Promise<boolean> {
    const runner = manager ?? this.dataSource;
    const result = await runner.query(
      'SELECT 1 FROM "AccountData" WHERE email = $1 AND deleted_at IS NULL LIMIT 1',
      [email],
    );
    return result.length > 0;
  }

  async findByLogin(login: string) {
    return await this.dataSource.query(
      `
        SELECT u.id,
               a.login,
               a.email,
               a.created_at,
               a.deleted_at,
               e.confirmation_code,
               e.recovery_code,
               e.issued_at,
               e.expiration_date,
               e.is_confirmed
        FROM "Users" u
               JOIN "AccountData" a ON u.id = a.id
               LEFT JOIN "EmailConfirmation" e ON u.id = e.id
        WHERE a.login = $1
      `,
      [login],
    );
  }

  async findByEmail(email: string) {
    const user =  await this.dataSource.query(
      `
        SELECT u.id,
               a.login,
               a.email,
               a.created_at,
               a.deleted_at,
               e.confirmation_code,
               e.recovery_code,
               e.issued_at,
               e.expiration_date,
               e.is_confirmed
        FROM "Users" u
               JOIN "AccountData" a ON u.id = a.id
               LEFT JOIN "EmailConfirmation" e ON u.id = e.id
        WHERE a.email = $1
      `,
      [email],
    );

    return user[0] || null;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await this.dataSource.query(
      `
      SELECT *
      FROM "Users" u
             JOIN "AccountData" a ON u.id = a.id
             LEFT JOIN "EmailConfirmation" e ON u.id = e.id
      WHERE a.email = $1 OR a.login = $1
    `,
      [loginOrEmail],
    );
    return user[0] || null;
  }

  async findByRecoveryCode(recoveryCode: string) {
    return this.dataSource.query(
      `
      SELECT *
      FROM "Users" u
             JOIN "AccountData" a ON u.id = a.id
             LEFT JOIN "EmailConfirmation" e ON u.id = e.id
      WHERE e.recovery_code = $1 
      `,
      [recoveryCode],
    );
  }

  async findByConfirmationCode(code: string) {
    return this.dataSource.query(
      `
        SELECT *
        FROM "Users" u
               JOIN "AccountData" a ON u.id = a.id
               LEFT JOIN "EmailConfirmation" e ON u.id = e.id
        WHERE e.confirmation_code = $1
      `,
      [code],
    );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async setConfirmation(id: string) {
    await this.dataSource.query(
      `
      UPDATE "EmailConfirmation" SET is_confirmed = true WHERE id = $1 
      `,
      [id],
    );
  }

  async updateRecoveryCode(id: string, recoveryCode: string) {
    await this.dataSource.query(
      'UPDATE "EmailConfirmation" SET recovery_code = $1 WHERE id = $2',
      [recoveryCode, id],
    );
  }

  async setConfirmationCode(id: string, code: string) {
    await this.dataSource.query(
      'UPDATE "EmailConfirmation" SET confirmation_code = $1 WHERE id = $2',
      [code, id],
    );
  }

  async setPasswordHash(id: string, passwordHash: string) {
    await this.dataSource.query(
      'UPDATE "AccountData" SET password_hash = $1 WHERE id = $2',
      [passwordHash, id],
    );
  }

  softDeleteUser(id: string) {
    return this.dataSource.query(
      `
      UPDATE "AccountData" SET deleted_at = NOW() WHERE id = $1
      `,
      [id],
    );
  }

  deleteUser(id: string) {
    return this.dataSource.query(`
    DELETE FROM "Users" WHERE id = $1 CASCADE
    `);
  }
}
