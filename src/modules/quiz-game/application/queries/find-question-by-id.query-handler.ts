import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuestionViewDto } from '../../api/view-dto/question.view-dto';
import { QuestionQueryRepository } from '../../infrastructure/query/question.query-repository';
import { DomainExceptionFactory } from '../../../../core/exception/filters/domain-exception-factory';

export class FindQuestionByIdQuery {
  constructor(public questionId: string) {}
}

@QueryHandler(FindQuestionByIdQuery)
export class FindQuestionByIdQueryHandler
  implements IQueryHandler<FindQuestionByIdQuery, QuestionViewDto>
{
  constructor(
    private readonly questionQueryRepository: QuestionQueryRepository,
  ) {}

  async execute({
    questionId,
  }: FindQuestionByIdQuery): Promise<QuestionViewDto> {
    const question =
      await this.questionQueryRepository.findQuestionById(questionId);
    if (!question) {
      throw DomainExceptionFactory.notFound('questionId', 'Question not found');
    }

    return question;
  }
}
