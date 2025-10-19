import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FindUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { UsersViewDto } from '../../api/view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAllUsers(
    query: FindUsersQueryParams,
  ): Promise<PaginatedViewDto<UsersViewDto[]>> {
    const loginTerm = query.searchLoginTerm
      ? `%${query.searchLoginTerm}%`
      : `%`;
    const emailTerm = query.searchEmailTerm
      ? `%${query.searchEmailTerm}%`
      : `%`;

    enum Sort {
      createdAt = 'a.createdAt',
      login = 'a.login',
      email = 'a.email',
    }

    const sortBy = Sort[query.sortBy] || Sort.createdAt;

    //создал базовый поиск для переиспользования в методе
    const createBaseQuery = () => {
      return this.usersRepository
        .createQueryBuilder('u')
        .leftJoin('u.accountData', 'a')
        .where('(a.login ILIKE :loginTerm OR a.email ILIKE :emailTerm)', {
          loginTerm,
          emailTerm,
        })
        .andWhere('a.deletedAt IS NULL');
    };

    const users = await createBaseQuery()
      .select('u.id', 'id')
      .addSelect('a.login', 'login')
      .addSelect('a.email', 'email')
      .addSelect('a.createdAt', 'createdAt')
      .orderBy(sortBy, query.sortDirection)
      .limit(query.pageSize)
      .offset(query.calculateSkip())
      .getRawMany();

    const totalCount = await createBaseQuery().getCount();

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
      .getRawOne();

    if (!user) return null;

    return UsersViewDto.mapToView(user);
  }
}
