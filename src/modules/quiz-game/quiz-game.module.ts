import { Module } from '@nestjs/common';
import { PairQuizGameController } from './api/pair-quiz-game.controller';
import { QuizQuestionsSuperAdminController } from './api/quiz-questions-super-admin.controller';

const useCases = [];

const queries = [];

@Module({
  imports: [],
  controllers: [PairQuizGameController, QuizQuestionsSuperAdminController],
  providers: [...useCases, ...queries],
  exports: [],
})
export class QuizGameModule {}
