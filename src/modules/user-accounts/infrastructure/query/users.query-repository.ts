import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAllUsers(query: GetUsersQueryParams) {
    const users = await this.dataSource.query(
      `SELECT u.user_id,
              ad.login,
              ad.email,
              ad.created_at
       FROM "Users" u
              JOIN "AccountData" ad ON u.user_id = ad.user_id`,
    );

    return users.map((e) => {
      return {
        id: e.user_id,
        login: e.login,
        email: e.email,
        createdAt: e.created_at,
      };
    });
  }
}
