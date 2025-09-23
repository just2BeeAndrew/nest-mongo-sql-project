import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserInputDto } from '../../api/input-dto/create-users.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { BcryptService } from '../../../bcrypt/application/bcrypt.service';
import { DataSource } from 'typeorm';

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

  async execute(command: CreateUserCommand):Promise<number> {
    return this.dataSource.transaction(async (t) => {
      const isLoginTaken = await this.usersRepository.isLoginTaken(
        command.dto.login,
        t,
      );
      if (isLoginTaken) {
        throw new DomainException({
          code: DomainExceptionCode.BadRequest,
          message: 'Bad Request ',
          extensions: [{ message: 'Login already taken', key: 'login' }],
        });
      }

      const isEmailTaken = await this.usersRepository.isEmailTaken(
        command.dto.email,
        t,
      );
      if (isEmailTaken) {
        throw new DomainException({
          code: DomainExceptionCode.BadRequest,
          message: 'Bad Request ',
          extensions: [{ message: 'Email already taken', key: 'email' }],
        });
      }

      const passwordHash = await this.bcryptService.createHash(
        command.dto.password,
      );

      return  await this.usersRepository.create(
        {
          login: command.dto.login,
          email: command.dto.email,
          passwordHash: passwordHash,
        },
        t,
      );
    });
  }
}
