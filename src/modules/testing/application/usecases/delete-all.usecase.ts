import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TestingRepository } from '../../infrastructure/testing.repository';

export class DeleteAllCommand {
  constructor() {}
}

@CommandHandler(DeleteAllCommand)
export class DeleteAllUseCase implements ICommandHandler<DeleteAllCommand> {
  constructor(private readonly testingRepository: TestingRepository) {}

  async execute(){
    return await this.testingRepository.deleteAll()
  }
}
