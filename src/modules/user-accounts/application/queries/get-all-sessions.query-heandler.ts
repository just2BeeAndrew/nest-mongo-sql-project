import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionsViewDto } from '../../api/view-dto/sessions.view-dto';
import { SessionsQueryRepository } from '../../infrastructure/query/session.query-repository';

export class FindAllSessionsQuery {
  constructor(public userId: string) {}
}

@QueryHandler(FindAllSessionsQuery)
export class FindAllSessionsQueryHandler
  implements IQueryHandler<FindAllSessionsQuery, SessionsViewDto[]>
{
  constructor(
    private readonly sessionsQueryRepository: SessionsQueryRepository,
  ) {}

  async execute(query: FindAllSessionsQuery): Promise<SessionsViewDto[]> {
    return this.sessionsQueryRepository.getAllSessions(query.userId)
  }
}


