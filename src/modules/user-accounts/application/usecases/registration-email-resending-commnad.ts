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
        message: 'Not found',
        extensions: [{ message: 'User not found', key: 'email' }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Bad Request',
        extensions: [{ message: 'User already confirmed', key: 'email' }],
      });
    }

    const newConfirmationCode = uuidv4();

    await this.usersRepository.setConfirmationCode(
      user.id,
      newConfirmationCode,
    );

    await this.emailService
      .sendConfirmationEmail(user.id, newConfirmationCode)
      .catch(console.error);
  }
}
