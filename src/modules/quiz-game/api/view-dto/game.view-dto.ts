import { AnswerStatus } from '../../domain/entity/answer.entity';
import { Question } from '../../domain/entity/question.entity';
import { QuestionViewDto } from './question.view-dto';
import { Game, GameStatus } from '../../domain/entity/game.entity';

export class AnswerViewDto {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: string;
}

export class PlayerViewDto {
  id: string;
  login: string;
}

export class PlayerProgressViewDto {
  answers: AnswerViewDto[];
  player: PlayerViewDto;
  score: number;
}

export class QuestionsViewDto {
  id: string;
  body: string;
}

export class GameViewDto {
  id: string;
  firstPlayerProgress: PlayerProgressViewDto;
  secondPlayerProgress: PlayerProgressViewDto;
  questions: QuestionsViewDto[];
  status: GameStatus;
  startGameDate: string;
  finishGameDate: string;

  static mapToView() {
    const dto = new GameViewDto();

    dto.id = gameId;
    dto.firstPlayerProgress
  }
}
