import { Controller, Delete, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllCommand } from '../application/usecases/delete-all.usecase';

@Controller('testing')
export class TestingController {
  constructor(
    private commandBus: CommandBus,
  ) {
  }

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll(){
    return this.commandBus.execute<DeleteAllCommand>(new DeleteAllCommand())
  }
}
