import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { UsersViewDto } from '../../api/view-dto/users.view-dto';
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
    const sortDirection = query.sortDirection.toUpperCase() as 'ASC' | 'DESC';
    //создал базовый поиск для переиспользования в методе
    const createBaseQuery = () => {
      const qb = this.usersRepository
        .createQueryBuilder('u')
        .innerJoin('u.accountData', 'a')
        .where('a.deletedAt IS NULL');

      const conditions: string[] = [];
      const parameters: any = {};

      if (query.searchLoginTerm) {
        conditions.push('a.login ILIKE :loginTerm');
        parameters.loginTerm = `%${query.searchLoginTerm}%`;
      }

      if (query.searchEmailTerm) {
        conditions.push('a.email ILIKE :emailTerm');
        parameters.emailTerm = `%${query.searchEmailTerm}%`;
      }

      if (conditions.length > 0) {
        qb.andWhere(`(${conditions.join(' OR ')})`, parameters);
      }

      return qb;
    };

    const users = createBaseQuery()
      .select('u.id', 'id')
      .addSelect('a.login', 'login')
      .addSelect('a.email', 'email')
      .addSelect('a.createdAt', 'createdAt');

    if (query.sortBy === 'createdAt') {
      users.orderBy('a.createdAt', sortDirection);
    } else {
      users.orderBy(`LOWER(a.${query.sortBy})`, sortDirection);
    }

    const usersSorted = await users
      .limit(query.pageSize)
      .offset(query.calculateSkip())
      .getRawMany();

    const totalCount = await createBaseQuery().getCount();

    const items = usersSorted.map(UsersViewDto.mapToView);

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
