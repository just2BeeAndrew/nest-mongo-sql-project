import {
  Column,
  Entity, OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { GameQuestion } from './game-question.entity';

export enum GameStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

@Entity({ name: 'Game' })
export class Game extends BaseEntity {
  @Column({ type: 'text' })
  status: GameStatus;

  @OneToMany(() => GameQuestion, gameQuestions => gameQuestions.game)
  gameQuestions: GameQuestion[];
}
