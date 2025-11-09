import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { DomainExceptionFactory } from '../../../../core/exception/filters/domain-exception-factory';

export class PublishQuestionCommand {
  constructor(
    public questionId: string,
    public published: boolean,
  ) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(command: PublishQuestionCommand) {
    const question = await this.questionRepository.findById(command.questionId);
    if (!question) {
      throw DomainExceptionFactory.notFound();
    }

    question.updatePublish(command.published);
    await this.questionRepository.saveQuestion(question);
  }
}
