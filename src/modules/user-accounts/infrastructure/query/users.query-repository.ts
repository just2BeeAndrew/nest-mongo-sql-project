import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAllUsers(query: GetUsersQueryParams) {
    const loginTerm = query.searchLoginTerm
      ? `%${query.searchLoginTerm}%`
      : `%`;
    const emailTerm = query.searchEmailTerm
      ? `%${query.searchEmailTerm}%`
      : `%`;
    const users = await this.dataSource.query(
      `
        SELECT u.user_id,
              a.login,
              a.email,
              a.created_at
       FROM "Users" u
              JOIN "AccountData" a ON u.user_id = a.user_id
       WHERE a.login ILIKE $1 AND a.email ILIKE $2
       `,
      [loginTerm, emailTerm],
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
