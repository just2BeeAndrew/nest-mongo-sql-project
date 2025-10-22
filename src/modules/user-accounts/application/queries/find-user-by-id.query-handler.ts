import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersViewDto } from '../../api/view-dto/users.view-dto';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class FindUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery, UsersViewDto>
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(query: FindUserByIdQuery): Promise<UsersViewDto> {
    const user = await this.usersQueryRepository.findUserById(query.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'User not found', field: 'user' }],
      });
    }

    return user;
  }
}
