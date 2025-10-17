import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../../notifications/application/email.service';

export class RegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
  implements ICommandHandler<RegistrationEmailResendingCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: RegistrationEmailResendingCommand) {
    const user = await this.usersRepository.findByEmail(command.email);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        extensions: [{ message: 'User not found', field: 'email' }],
      });
    }

    if (user.is_confirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        extensions: [{ message: 'User already confirmed', field: 'email' }],
      });
    }

    const newConfirmationCode = uuidv4();

    await this.usersRepository.setConfirmationCode(
      user.id,
      newConfirmationCode,
    );

    this.emailService
      .sendConfirmationEmail(command.email, newConfirmationCode)
      .catch(console.error);
  }
}
