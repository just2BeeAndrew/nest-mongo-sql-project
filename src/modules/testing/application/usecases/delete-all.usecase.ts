import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteAllCommand {
  constructor() {}
}

@CommandHandler(DeleteAllCommand)
export class DeleteAllUseCase implements ICommandHandler<DeleteAllCommand>{
  constructor(private readonly dto: DeleteAllCommand){}

}
