import { Injectable } from '@nestjs/common';
import { Question } from '../domain/entity/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async saveQuestion(question: Question): Promise<Question> {
    return await this.questionRepository.save(question);
  }

  async findById(questionId: string): Promise<Question | null> {
    return await this.questionRepository.findOneBy({ id: questionId, published: false });
  }

  async softDelete(questionId: string) {
    return await this.questionRepository.softDelete({ id: questionId });
  }
}
