import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../domain/entity/player.entity';
import { Repository } from 'typeorm';

export class PlayerRepository {
  constructor(@InjectRepository(Player) private platerRepository: Repository<Player>,) {
  }

  async save(player: Player): Promise<Player>  {
    return await this.platerRepository.save(player);
  }
}