import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';

export class SetConfirmationCommand {
  constructor(public userId: string) {}
}

@CommandHandler(SetConfirmationCommand)
export class SetConfirmationUseCase implements ICommandHandler<SetConfirmationCommand>{
  constructor(private readonly usersRepository: UsersRepository) {
  }

  async execute(command: SetConfirmationCommand){
    await this.usersRepository.setConfirmation
  }
}
