import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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
    const user = await this.usersRepository.findByConfirmationCode(
      command.code,
    );
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        extension: [{ message: 'User not found', field: 'code' }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        extension: [{ message: 'User already confirmed', field: 'code' }],
      });
    }

    if (user.emailConfirmation.confirmationCode !== command.code) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        extension: [{ message: 'Invalid confirmation code', field: 'code' }],
      });
    }

    if (user.emailConfirmation.expirationTime < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        extension: [
          { message: 'Invalid expiration date', field: 'expirationDate' },
        ],
      });
    }

    await this.usersRepository.setConfirmation(user.id);
  }
}
