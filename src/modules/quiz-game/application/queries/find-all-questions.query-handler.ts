import { FindQuestionsQueryParams } from '../../api/input-dto/find-questions-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { QuestionViewDto } from '../../api/view-dto/question.view-dto';
import { QuestionQueryRepository } from '../../infrastructure/query/question.query-repository';

export class FindAllQuestionsQuery {
  constructor(public query: FindQuestionsQueryParams) {}
}

@QueryHandler(FindAllQuestionsQuery)
export class FindAllQuestionsQueryHandler
  implements
    IQueryHandler<FindAllQuestionsQuery, PaginatedViewDto<QuestionViewDto[]>>
{
  constructor(
    private readonly questionQueryRepository: QuestionQueryRepository,
  ) {}

  async execute({
    query,
  }: FindAllQuestionsQuery): Promise<PaginatedViewDto<QuestionViewDto[]>> {
    return await this.questionQueryRepository.findAllQuestions(query);
  }
}
