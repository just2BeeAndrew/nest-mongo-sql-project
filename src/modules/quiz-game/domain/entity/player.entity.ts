import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../../user-accounts/domain/entities/user.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { Answer } from './answer.entity';
import { Game } from './game.entity';

@Entity({ name: 'Player' })
export class Player extends BaseEntity {
  @Column({ type: 'int' })
  score: number;

  @OneToMany(() => Answer, (answers) => answers.player)
  answers: Answer[];

  @ManyToOne(() => User, (user) => user.players)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(()=> Game, (game) => game.players)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column({ type: 'uuid' })
  gameId: string;


}
