import { CreateUserInputDto } from '../../api/input-dto/create-users.input-dto';
import { CommandHandler } from '@nestjs/cqrs';

export class CreateUserByAdminCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserByAdminCommand)