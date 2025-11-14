import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../domain/entity/player.entity';
import { Repository } from 'typeorm';
import { GameStatus } from '../domain/entity/game.entity';

export class PlayerRepository {
  constructor(
    @InjectRepository(Player) private platerRepository: Repository<Player>,
  ) {}

  async save(player: Player): Promise<Player> {
    return await this.platerRepository.save(player);
  }

  async isActivePlayer(userId: string) {
    return await this.platerRepository.findOne({
      where: { userId: userId, game: { status: GameStatus.Active } },
      relations: ['game'],
    });
  }
}
