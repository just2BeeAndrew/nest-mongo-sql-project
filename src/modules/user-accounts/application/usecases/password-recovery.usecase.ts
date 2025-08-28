import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import {v4 as uuidv4} from 'uuid'

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand>{
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const user = await this.usersRepository.findByEmail(command.email);

    const recoveryCode = uuidv4()

    this.usersRepository.updateRecoveryCode(user.id, recoveryCode)
  }


}
