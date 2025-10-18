import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { loginConstants } from '../../constants/users.constants';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: RegistrationConfirmationCommand) {
    const user = await this.usersRepository.findByConfirmationCode(
      command.code,
    );
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User not found',
        field: 'code',
      });
    }

    if (user.is_confirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User already confirmed',
        field: 'code',
      });
    }

    if (user.confirmation_code !== command.code) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid confirmation code',
        field: 'code',
      });
    }

    if (user.expiration_date < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid expiration date',
        field: 'expirationDate',
      });
    }

    await this.usersRepository.setConfirmation(user.id);
  }
}
