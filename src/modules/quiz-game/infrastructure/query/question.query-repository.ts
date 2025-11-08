import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../domain/entity/question.entity';
import { Repository } from 'typeorm';
import {
  QuestionRaw,
  QuestionViewDto,
} from '../../api/view-dto/question.view-dto';

@Injectable()
export class QuestionQueryRepository{
  constructor(@InjectRepository(Question) private readonly questionRepository: Repository<Question>) {
  }

  async findQuestionById(id: string): Promise<QuestionViewDto | null> {
    const question = await this.questionRepository
      .createQueryBuilder('q')
      .select([
        'q.id AS id',
        'q.body AS body',
        'q.correctAnswers AS "correctAnswers"',
        'q.published AS published',
        'q.createdAt AS "createdAt"',
        'q.updatedAt AS "updatedAt"',
      ])
      .where('q.id = :id', { id })
      .getRawOne<QuestionRaw>()

    if (!question) return  null

    return QuestionViewDto.mapToView(question);
  }
}