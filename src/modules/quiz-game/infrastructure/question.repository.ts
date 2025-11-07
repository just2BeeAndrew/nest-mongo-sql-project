import { Injectable } from '@nestjs/common';
import { Question } from '../domain/entity/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionRepository {
  constructor(@InjectRepository(Question) private readonly questionRepository: Repository<Question>) {
  }

  async saveQuestion(question: Question): Promise<Question> {
    return await this.questionRepository.save(question);
  }
}