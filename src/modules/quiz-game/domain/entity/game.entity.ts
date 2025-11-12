import {
  Column,
  Entity, OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { GameQuestion } from './game-question.entity';
import { Player } from './player.entity';

export enum GameStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

@Entity({ name: 'Game' })
export class Game extends BaseEntity {
  @Column({ type: 'text', default: GameStatus.PendingSecondPlayer })
  status: GameStatus;

  @OneToMany(() => GameQuestion, gameQuestions => gameQuestions.game)
  gameQuestions: GameQuestion[];

  @OneToMany(() => Player, players => players.game)
  players: Player[];

  static createGame(player: Player, question: GameQuestion[] ) {
    const game = new Game();
    game.gameQuestions = question;
    game.players = [player];

    return game;
  }
}
