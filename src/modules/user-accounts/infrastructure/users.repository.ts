import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params.input-dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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

  async updateRecoveryCode(id: string, recoveryCode: string) {
    await this.dataSource.query(
      'UPDATE "EmailConfirmation" SET recovery_code = $1 WHERE id = $2',
      [recoveryCode, id],
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
