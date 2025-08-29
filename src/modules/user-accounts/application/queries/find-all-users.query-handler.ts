import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';

export class FindAllUsersQuery {
  constructor(public query: GetUsersQueryParams) {}
}

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersQueryHandler
  implements IQueryHandler<FindAllUsersQuery>
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(query: FindAllUsersQuery) {
    return this.usersQueryRepository.findAllUsers(query.query);
  }
}
