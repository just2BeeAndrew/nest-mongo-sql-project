import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersViewDto } from '../../api/view-dto/users.view-dto';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';

export class FindUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery, UsersViewDto>
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(query: FindUserByIdQuery): Promise<UsersViewDto> {
    return this.usersQueryRepository.findUserById(query.userId);
  }
}
