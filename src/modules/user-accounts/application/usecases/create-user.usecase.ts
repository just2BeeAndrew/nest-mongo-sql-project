import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserInputDto } from '../../api/input-dto/create-users.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { BcryptService } from '../../../bcrypt/application/bcrypt.service';
import { User } from '../../domain/entities/user.entity';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserInputDto) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
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
        extension: [{ message: 'Login already taken', field: 'login' }],
      });
    }

    const isEmailTaken = await this.usersRepository.isEmailTaken(
      command.dto.email,
    );
    if (isEmailTaken) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        extension: [{ message: 'Email already taken', field: 'email' }],
      });
    }

    const passwordHash = await this.bcryptService.createHash(
      command.dto.password,
    );
    const user = User.create({
      login: command.dto.login,
      email: command.dto.email,
      passwordHash: passwordHash,
    });

    await this.usersRepository.saveUser(user);

    return user.id;
  }
}
