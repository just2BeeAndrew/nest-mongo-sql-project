import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../../core/guards/basic/basic-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../application/usecases/create-question.usecase';
import { CreateQuestionInputDto } from './input-dto/create-question.input-dto';
import { FindQuestionByIdQuery } from '../application/queries/find-question-by-id.query-handler';
import { DeleteQuestionCommand } from '../application/usecases/delete-question.usecase';
import { UpdateQuestionInputDto } from './input-dto/update-question.input-dto';
import { UpdateQuestionCommand } from '../application/usecases/update-question.usecase';
import { PublishQuestionInputDTO } from './input-dto/publish-question.input-dto';
import { PublishQuestionCommand } from '../application/usecases/publish-question.usecase';

@Controller('sa/quiz/questions')
export class QuizQuestionsSuperAdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() body: CreateQuestionInputDto) {
    const questionId = await this.commandBus.execute<
      CreateQuestionCommand,
      string
    >(new CreateQuestionCommand(body));

    return this.queryBus.execute(new FindQuestionByIdQuery(questionId));
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('id') id: string) {
    return await this.commandBus.execute<DeleteQuestionCommand>(
      new DeleteQuestionCommand(id),
    );
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
    @Param('id') id: string,
    @Body() body: UpdateQuestionInputDto,
  ) {
    return await this.commandBus.execute<UpdateQuestionCommand>(
      new UpdateQuestionCommand(id, body),
    );
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async publishQuestion(
    @Param('id') id: string,
    @Body() body: PublishQuestionInputDTO,
  ) {
    return await this.commandBus.execute<PublishQuestionCommand>(
      new PublishQuestionCommand(id, body.published),
    );
  }
}
