import { Module } from '@nestjs/common';
import { PairQuizGameController } from './api/pair-quiz-game.controller';
import { QuizQuestionsSuperAdminController } from './api/quiz-questions-super-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity/question.entity';
import { Answer } from './domain/entity/answer.entity';
import { Game } from './domain/entity/game.entity';
import { GameQuestion } from './domain/entity/game-question.entity';
import { Player } from './domain/entity/player.entity';

const useCases = [];

const queries = [];

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Game, GameQuestion, Player, Question]),
  ],
  controllers: [PairQuizGameController, QuizQuestionsSuperAdminController],
  providers: [...useCases, ...queries],
  exports: [],
})
export class QuizGameModule {}
