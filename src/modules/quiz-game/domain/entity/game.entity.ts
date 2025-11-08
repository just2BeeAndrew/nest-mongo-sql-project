import {
  Column,
  Entity,
} from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';

export enum GameStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

@Entity({ name: 'Game' })
export class Game extends BaseEntity {
  @Column({ type: 'text' })
  status: GameStatus;
}
