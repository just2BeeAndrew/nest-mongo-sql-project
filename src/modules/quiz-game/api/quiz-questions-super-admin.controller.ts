import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../../core/guards/basic/basic-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../application/usecases/create-question.usecase';
import { CreateQuestionInputDto } from './input-dto/create-question.input-dto';

@Controller('pair-quiz-game-super-admin')
export class QuizQuestionsSuperAdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() body: CreateQuestionInputDto) {
    const question = await this.commandBus.execute<
      CreateQuestionCommand,
      string
    >(new CreateQuestionCommand(body));
  }
}
