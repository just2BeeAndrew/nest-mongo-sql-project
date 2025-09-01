import { CreateUserInputDto } from '../../api/input-dto/create-users.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';

export class CreateUserByAdminCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminUseCase implements ICommandHandler<CreateUserByAdminCommand, string> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: CreateUserByAdminCommand) {

  }
}