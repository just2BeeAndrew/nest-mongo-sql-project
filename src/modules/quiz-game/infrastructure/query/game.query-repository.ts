import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../domain/entity/game.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameQueryRepository {
  constructor(@InjectRepository(Game) private readonly gameRepository: Repository<Game>,) {
  }

  async findGameById(gameId: string) {
    const game = await this.gameRepository
    .createQueryBuilder('g')

  }
}