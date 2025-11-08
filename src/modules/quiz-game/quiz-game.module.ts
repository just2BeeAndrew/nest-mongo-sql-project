import { Module } from '@nestjs/common';
import { PairQuizGameController } from './api/pair-quiz-game.controller';
import { QuizQuestionsSuperAdminController } from './api/quiz-questions-super-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity/question.entity';
import { Answer } from './domain/entity/answer.entity';
import { Game } from './domain/entity/game.entity';
import { GameQuestion } from './domain/entity/game-question.entity';
import { Player } from './domain/entity/player.entity';
import { CreateQuestionUseCase } from './application/usecases/create-question.usecase';
import { QuestionRepository } from './infrastructure/question.repository';
import { FindQuestionByIdQueryHandler } from './application/queries/find-question-by-id.query-handler';
import { QuestionQueryRepository } from './infrastructure/query/question.query-repository';

const useCases = [CreateQuestionUseCase];

const queries = [FindQuestionByIdQueryHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Game, GameQuestion, Player, Question]),
  ],
  controllers: [PairQuizGameController, QuizQuestionsSuperAdminController],
  providers: [QuestionRepository, QuestionQueryRepository, ...useCases, ...queries],
  exports: [],
})
export class QuizGameModule {}
