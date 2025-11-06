import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user-accounts/domain/entities/user.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { Answer } from './answer.entity';

@Entity({ name: 'Player' })
export class Player extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  score: number;

  @ManyToOne(() => User, (user) => user.players)
  @JoinColumn({ name: 'userId'})
  user: User;

  @Column({ type: 'uuid'})
  userId: string;

  @OneToMany(()=> Answer, (answers) => answers.player)
  answers: Answer[];
}