import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/query/game.repository';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { DomainExceptionFactory } from '../../../../core/exception/filters/domain-exception-factory';
import { Game } from '../../domain/entity/game.entity';
import { Player } from '../../domain/entity/player.entity';

export class ConnectionCommand{
  constructor(public userId:string) {
  }
}

@CommandHandler(ConnectionCommand)
export class ConnectionUseCase implements ICommandHandler<ConnectionCommand> {
  constructor(private gameRepository: GameRepository,
              private usersRepository: UsersRepository,) {
  }

  async execute({userId}: ConnectionCommand) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw DomainExceptionFactory.notFound()
    }
    const player = Player.createPlayer(user)

    const question =

    const game = await this.gameRepository.findGamePending()
    if (!game) {
      Game.createGame(player)


    }
  }
}