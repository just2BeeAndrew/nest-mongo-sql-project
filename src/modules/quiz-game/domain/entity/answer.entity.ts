import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { Player } from './player.entity';

export enum AnswerStatus {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

@Entity({name: 'Answer'})
export class Answer extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: "text"})
  answerStatus: AnswerStatus;

  @ManyToOne(()=> Player, (player) = player.answers )
  @JoinColumn({name:'playerId'})
  player: Player;

  @Column({type:'uuid'})
  playerId: string;


}