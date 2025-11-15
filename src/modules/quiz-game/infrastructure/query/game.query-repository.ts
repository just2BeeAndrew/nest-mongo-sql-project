import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../domain/entity/game.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GameViewDto } from '../../api/view-dto/game.view-dto';

@Injectable()
export class GameQueryRepository {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async findGameById(gameId: string) {
    const game = await this.gameRepository
      .createQueryBuilder('g')
      .leftJoin('g.players', 'p')
      .leftJoin('player.answers', 'a')
      .leftJoin('player.user', 'u')
      .leftJoin('user.accountData', 'ad')
      .select([
        'g.*',
        'p.*',
        'a.*',
        'u.*',
        'ad.*'
      ])
      .getRawOne();

    const firstPlayerAnswers = game.players[0].answers.map((answer) => ({
      questionId: answer.questionId,
      answerStatus: answer.answerStatus,
      addedAt: answer.createdAt.toISOString(),
    }));

    return GameViewDto.mapToView({
    })


  }
}
