import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params.input-dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async create(dto: CreateUserDto, t: any) {
    const user = await t.query(
      `
          WITH insert_user AS (
          INSERT
          INTO Users DEFAULT
          VALUES RETURNING user_id
            ), insert_account_data AS (
          INSERT
          INTO AccountData (user_id, login, password_hash, email, created_at, deleted_at)
          SELECT user_id, $1, $2, $3, NOW(), NULL
          FROM insert_user
            RETURNING user_id
            )
          INSERT
          INTO EmailConfirmation (user_id, confirmation_code, recovery_code, issued_at, expiration_date, is_confirmed)
          SELECT user_id, NULL, NULL, NOW(), NOW() + interval '1 day', false
          FROM insert_account_data
            RETURNING user_id;
      `,
      [dto.login, dto.passwordHash, dto.email],
    );
    return user[0].user_id.toString();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async isLoginTaken(login: string, manager?: any): Promise<boolean> {
    const runner = manager ?? this.dataSource;
    const result = await runner.query(
      'SELECT 1 FROM AccountData WHERE login = $1 LIMIT 1',
      [login]
    );
    return result.length > 0;
  }

  async isEmailTaken(email: string, manager?: any): Promise<boolean> {
    const runner = manager ?? this.dataSource;
    const result = await runner.query(
      'SELECT 1 FROM AccountData WHERE email = $1 LIMIT 1',
      [email]
    );
    return result.length > 0;
  }

  async findByLogin(login: string) {
    return await this.dataSource.query(
      `
        SELECT u.user_id,
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
               JOIN "AccountData" a ON u.user_id = a.user_id
               LEFT JOIN "EmailConfirmation" e ON u.user_id = e.user_id
        WHERE a.login = $1
      `,
      [login],
    );
  }

  async findByEmail(email: string) {
    return await this.dataSource.query(
      `
        SELECT u.user_id,
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
               JOIN "AccountData" a ON u.user_id = a.user_id
               LEFT JOIN "EmailConfirmation" e ON u.user_id = e.user_id
        WHERE a.email = $1
      `,
      [email],
    );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async setConfirmation(userId: string){
    await this.dataSource.query(
      `
      UPDATE "EmailConfirmation" SET is_confirmed = true WHERE user_id = $1 
      `,
      [userId]
    )
  }

  async updateRecoveryCode(id: string, recoveryCode: string) {
    await this.dataSource.query(
      'UPDATE "EmailConfirmation" SET recovery_code = $1 WHERE user_id = $2',
      [recoveryCode, id],
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
