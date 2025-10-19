import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('AccountData')
export class AccountData {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column()
  login: string;

  @Column()
  passwordHash: string;

  @Column()
  email: string;
  //TODO: Вынести в абстрактную сущность
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId',
  })
  user: User;
}
