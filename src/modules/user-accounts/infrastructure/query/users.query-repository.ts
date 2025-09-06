import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { UsersViewDto } from '../../api/view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAllUsers(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UsersViewDto[]>> {
    const loginTerm = query.searchLoginTerm
      ? `%${query.searchLoginTerm}%`
      : `%`;
    const emailTerm = query.searchEmailTerm
      ? `%${query.searchEmailTerm}%`
      : `%`;

    const sortByMapping = {
      createdAt: 'a.created_at',
      login: 'a.login',
      email: 'a.email',
    };

    const sortBy = sortByMapping[query.sortBy] || 'a.created_at';

    const users = await this.dataSource.query(
      `
        SELECT u.id,
               a.login,
               a.email,
               a.created_at
        FROM "Users" u
               JOIN "AccountData" a ON u.id = a.id
        WHERE a.login ILIKE $1
          AND a.email ILIKE $2
          AND a.deleted_at IS NULL
        ORDER BY ${sortBy} /*COLLATE "C"*/ ${query.sortDirection}
          LIMIT $3
        OFFSET $4
      `,
      [loginTerm, emailTerm, query.pageSize, query.calculateSkip()],
    );

    const totalCountResult = await this.dataSource.query(
      `
      SELECT COUNT(*) as count
      FROM "Users" u
             JOIN "AccountData" a ON u.id = a.id
      WHERE a.login ILIKE $1
        AND a.email ILIKE $2
    `,
      [loginTerm, emailTerm],
    );

    const totalCount = parseInt(totalCountResult[0]?.count || '0', 10);

    const items = users.map(UsersViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findUserById(id: number) {
    const user = await this.dataSource.query(
      `
        SELECT u.id,
               a.login,
               a.email,
               a.created_at,
        FROM "Users" u
               JOIN "AccountData" a ON u.id = a.id
               LEFT JOIN "EmailConfirmation" e ON u.id = e.id
        WHERE u.id = $1
      `,
      [id],
    );

    return UsersViewDto.mapToView(user);
  }
}
