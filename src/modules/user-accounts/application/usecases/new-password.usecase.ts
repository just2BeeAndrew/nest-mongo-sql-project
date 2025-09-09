import { NewPasswordInputDto } from '../../api/input-dto/new-password.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { BcryptService } from '../../../bcrypt/application/bcrypt.service';

export class NewPasswordCommand {
  constructor(public dto: NewPasswordInputDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(command: NewPasswordCommand) {
    const user = await this.usersRepository.findByRecoveryCode(
      command.dto.recoveryCode,
    );
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User not found',
      });
    }
    const newPasswordHash = await this.bcryptService.createHash(
      command.dto.newPassword,
    );

    await this.usersRepository.setPasswordHash(user.id, newPasswordHash);
  }
}
