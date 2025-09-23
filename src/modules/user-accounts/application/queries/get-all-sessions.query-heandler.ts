import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionsViewDto } from '../../api/view-dto/sessions.view-dto';
import { SessionsQueryRepository } from '../../infrastructure/query/session.query-repository';

export class GetAllSessionsQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetAllSessionsQuery)
export class FindAllSessionsQueryHandler
  implements IQueryHandler<GetAllSessionsQuery, SessionsViewDto[]>
{
  constructor(
    private readonly sessionsQueryRepository: SessionsQueryRepository,
  ) {}

  async execute(query: GetAllSessionsQuery): Promise<SessionsViewDto[]> {
    return this.sessionsQueryRepository.getAllSessions(query.userId)
  }
}


