import { CreateUserInputDto } from '../../api/input-dto/create-users.input-dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.usecase';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../../infrastructure/users.repository';
import { EmailService } from '../../../notifications/application/email.service';

export class RegistrationCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    private commandBus: CommandBus,
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: RegistrationCommand) {
    const userId = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(command.dto),
    );

    const confirmCode = uuidv4();

    await this.usersRepository.setConfirmationCode(userId, confirmCode);

    try {
      this.emailService.sendConfirmationEmail(command.dto.email, confirmCode);
    } catch {
      await this.usersRepository.deleteUser(userId);
      console.error();
    }
  }
}
