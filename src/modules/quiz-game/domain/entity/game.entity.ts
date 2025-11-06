import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @OneToOne(() => PlayerProgress)
  @JoinColumn()
  @Column()
  firstPlayerProgress: PlayerProgress

  @OneToOne(() => PlayerProgress)
  @JoinColumn()
  @Column()
  secondPlayerProgress: PlayerProgress

  @Column({array: true})
  questions: Question[]; // массив вопросов для этой игры, хранящийся в виде массива, а не связи
}