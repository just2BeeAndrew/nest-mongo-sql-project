import { FindUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UsersViewDto } from '../../api/view-dto/users.view-dto';

export class FindAllUsersQuery {
  constructor(public query: FindUsersQueryParams) {}
}

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersQueryHandler
  implements IQueryHandler<FindAllUsersQuery,PaginatedViewDto<UsersViewDto[]>>
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(query: FindAllUsersQuery): Promise<PaginatedViewDto<UsersViewDto[]>> {
    return this.usersQueryRepository.findAllUsers(query.query);
  }
}
