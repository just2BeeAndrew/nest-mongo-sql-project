import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { CreateQuestionDomainDto } from '../dto/create-question.domain.dto';

@Entity({ name: 'Question' })
export class Question extends BaseEntity {
  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb' })
  correctAnswers: string[];

  @Column({ type: 'boolean', default: false })
  published: boolean;

  static create(dto: CreateQuestionDomainDto) {
    const question = new Question();

    question.body = dto.body;
    question.correctAnswers = dto.correctAnswers;

    return question;
  }
}
