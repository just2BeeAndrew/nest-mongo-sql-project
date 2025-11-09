import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class DeleteQuestionCommand {
  constructor(public questionId: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({ questionId }: DeleteQuestionCommand) {
    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{message: 'Question not found', field: 'questionId'}],
      });
    }

    await this.questionRepository.softDelete(question.id);
  }
}
