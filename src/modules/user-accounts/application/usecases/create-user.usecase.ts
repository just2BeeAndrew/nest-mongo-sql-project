import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserInputDto } from '../../api/input-dto/create-users.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { BcryptService } from '../../../bcrypt/application/bcrypt.service';
import { DataSource } from 'typeorm';
import {
  AccountData,
  EmailConfirmation,
  User,
} from '../../domain/entities/user.entity';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, number>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(command: CreateUserCommand) {
    const manager = this.dataSource.manager

    const passwordHash = await this.bcryptService.createHash(
      command.dto.password,
    );

    const user = new User();

    const accountData = new AccountData();
    accountData.user = user; //устанавливаю связь с User
    accountData.login = command.dto.login;
    accountData.email = command.dto.email;
    accountData.passwordHash = passwordHash;

    // Привязываем к User для каскада
    user.accountData = accountData;

    const emailConfirmation = new EmailConfirmation();
    emailConfirmation.user = user;
    emailConfirmation.issuedAt = new Date();
    emailConfirmation.expirationTime = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    user.emailConfirmation = emailConfirmation;

    await this.usersRepository.createUser(user)

    // return this.dataSource.transaction(async (t) => {
    //   const isLoginTaken = await this.usersRepository.isLoginTaken(
    //     command.dto.login,
    //     t,
    //   );
    //   if (isLoginTaken) {
    //     throw new DomainException({
    //       code: DomainExceptionCode.BadRequest,
    //       message: 'Bad Request ',
    //       extensions: [{ message: 'Login already taken', key: 'login' }],
    //     });
    //   }
    //
    //   const isEmailTaken = await this.usersRepository.isEmailTaken(
    //     command.dto.email,
    //     t,
    //   );
    //   if (isEmailTaken) {
    //     throw new DomainException({
    //       code: DomainExceptionCode.BadRequest,
    //       message: 'Bad Request ',
    //       extensions: [{ message: 'Email already taken', key: 'email' }],
    //     });
    //   }
    //
    //   const passwordHash = await this.bcryptService.createHash(
    //     command.dto.password,
    //   );
    //
    //   return  await this.usersRepository.create(
    //     {
    //       login: command.dto.login,
    //       email: command.dto.email,
    //       passwordHash: passwordHash,
    //     },
    //     t,
    //   );
    // });
  }
}
