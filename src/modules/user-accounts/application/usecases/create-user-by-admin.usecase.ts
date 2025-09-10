import { CreateUserInputDto } from '../../api/input-dto/create-users.input-dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserCommand } from './create-user.usecase';
import { SetConfirmationCommand } from './set-confirmation.usecase';

export class CreateUserByAdminCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminUseCase
  implements ICommandHandler<CreateUserByAdminCommand, string>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateUserByAdminCommand) {
    const userId = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(command.dto),
    );

    await this.commandBus.execute<SetConfirmationCommand>(new SetConfirmationCommand(userId));

    return userId;
  }
}