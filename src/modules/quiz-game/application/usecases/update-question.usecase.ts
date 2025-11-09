import { UpdateQuestionInputDto } from '../../api/input-dto/update-question.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { DomainExceptionFactory } from '../../../../core/exception/filters/domain-exception-factory';

export class UpdateQuestionCommand {
  constructor(
    public questionId: string,
    public dto: UpdateQuestionInputDto,
  ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(command: UpdateQuestionCommand) {
    const question = await this.questionRepository.findById(command.questionId);
    if (!question) {
      throw DomainExceptionFactory.notFound();
    }

    question.updateQuestion(command.dto.body, command.dto.correctAnswers);
    await this.questionRepository.saveQuestion(question);
  }
}
