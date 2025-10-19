import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserCommand) {
    const user = await this.usersRepository.softDeleteUser(id);
    if (user.affected === 0) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found or already deleted',
        field: 'user',
      });
    }
  }
}
