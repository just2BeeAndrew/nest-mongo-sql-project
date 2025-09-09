import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: RegistrationConfirmationCommand) {
    const user = await this.usersRepository.findByConfirmationCode(command.code);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Not found',
        extensions: [{ message: 'User not found', key: 'code' }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "Bad Request",
        extensions: [{ message: 'User already confirmed', key: 'code' }],
      });
    }

    if (user.emailConfirmation.confirmationCode !== command.code) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Bad Request',
        extensions: [{ message: 'Invalid confirmation code', key: 'code' }],
      });
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Bad Request',
        extensions: [{ message: 'Invalid expiration date', key: 'expirationDate' }],
      });
    }

    await this.usersRepository.setConfirmation(user.id)
  }
}