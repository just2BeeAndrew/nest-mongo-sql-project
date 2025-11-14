import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GameQueryRepository } from '../../infrastructure/query/game.query-repository';
import { DomainExceptionFactory } from '../../../../core/exception/filters/domain-exception-factory';

export class FindGameByIdQuery {
  constructor(public gameId: string) {}
}

@QueryHandler(FindGameByIdQuery)
export class FindGameByIdQueryHandler
  implements IQueryHandler<FindGameByIdQuery>
{
  constructor(private readonly gameQueryRepository: GameQueryRepository) {}

  async execute({ gameId }: FindGameByIdQuery) {
    const game = await this.gameQueryRepository.findGameById(gameId);
    if (!game) {
      throw DomainExceptionFactory.notFound('gameId', 'Game not found');
    }

    return game;
  }
}
