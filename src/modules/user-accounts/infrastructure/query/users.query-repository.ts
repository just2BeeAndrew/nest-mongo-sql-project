import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { UserRaw, UsersViewDto } from '../../api/view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAllUsers(
    query: FindUsersQueryParams,
  ): Promise<PaginatedViewDto<UsersViewDto[]>> {
    const loginTerm = query.searchLoginTerm
      ? `%${query.searchLoginTerm}%`
      : null;
    const emailTerm = query.searchEmailTerm
      ? `%${query.searchEmailTerm}%`
      : null;

    const sortDirection = query.sortDirection.toUpperCase() as 'ASC' | 'DESC';

    let qb = this.usersRepository
      .createQueryBuilder('u')
      .innerJoin('u.accountData', 'a')
      .select([
        'u.id AS id',
        'a.login AS login',
        'a.email AS email',
        'a.createdAt AS "createdAt"',
      ])
      .where('a.deletedAt IS NULL');

    if (loginTerm && emailTerm) {
      qb = qb.andWhere(
        '(a.login ILIKE :loginTerm OR a.email ILIKE :emailTerm)',
        {
          loginTerm,
          emailTerm,
        },
      );
    } else if (loginTerm) {
      qb = qb.andWhere('a.login ILIKE :loginTerm', { loginTerm });
    } else if (emailTerm) {
      qb = qb.andWhere('a.email ILIKE :emailTerm', { emailTerm });
    }

    if (query.sortBy === 'createdAt') {
      qb = qb.orderBy('a.createdAt', sortDirection);
    } else {
      qb = qb.orderBy(`a.${query.sortBy}`, sortDirection);
    }

    qb = qb
      .limit(query.pageSize)
      .offset(query.calculateSkip());

    const users = await qb.getRawMany<UserRaw>();

    let countUsers = this.usersRepository
      .createQueryBuilder('u')
      .innerJoin('u.accountData', 'a')
      .where('a.deletedAt IS NULL');

    if (loginTerm && emailTerm) {
      countUsers = countUsers.andWhere('(a.login ILIKE :loginTerm OR a.email ILIKE :emailTerm)', {
        loginTerm,
        emailTerm,
      });
    } else if (loginTerm) {
      countUsers = countUsers.andWhere('a.login ILIKE :loginTerm', { loginTerm });
    } else if (emailTerm) {
      countUsers = countUsers.andWhere('a.email ILIKE :emailTerm', { emailTerm });
    }

    const totalCount = await countUsers.getCount();

    const items = users.map(UsersViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findUserById(id: string): Promise<UsersViewDto | null> {
    const user = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoin('u.accountData', 'a')
      .select('u.id', 'id')
      .addSelect('a.login', 'login')
      .addSelect('a.email', 'email')
      .addSelect('a.createdAt', 'createdAt')
      .where('u.id=:id', { id })
      .andWhere('a.deletedAt IS NULL')
      .getRawOne<UserRaw>();

    if (!user) return null;

    return UsersViewDto.mapToView(user);
  }
}
