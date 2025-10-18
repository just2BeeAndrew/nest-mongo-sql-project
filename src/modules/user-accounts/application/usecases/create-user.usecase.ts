import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserInputDto } from '../../api/input-dto/create-users.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { BcryptService } from '../../../bcrypt/application/bcrypt.service';
import { DataSource } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { AccountData } from '../../domain/entities/account-data.entity';
import { EmailConfirmation } from '../../domain/entities/email-confirmation.entity';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(command: CreateUserCommand) {
    const isLoginTaken = await this.usersRepository.isLoginTaken(
      command.dto.login,
    );
    if (isLoginTaken) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Login already taken',
        field: 'login',
      });
    }

    const isEmailTaken = await this.usersRepository.isEmailTaken(
      command.dto.email,
    );
    if (isEmailTaken) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already taken',
        field: 'email',
      });
    }

    const passwordHash = await this.bcryptService.createHash(
      command.dto.password,
    );

    const user = new User();

    const accountData = new AccountData();
    accountData.login = command.dto.login;
    accountData.email = command.dto.email;
    accountData.passwordHash = passwordHash;

    accountData.user = user; //устанавливаю связь с User

    const emailConfirmation = new EmailConfirmation();
    emailConfirmation.issuedAt = new Date();
    emailConfirmation.expirationTime = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    emailConfirmation.user = user;

    user.accountData = accountData;
    user.emailConfirmation = emailConfirmation;

    const createdUser = await this.usersRepository.saveUser(user);

    return createdUser.id;
  }
}
