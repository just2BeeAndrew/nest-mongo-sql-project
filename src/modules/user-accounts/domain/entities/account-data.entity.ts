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

  @Column({collation: 'C.utf8'})
  login: string;

  @Column()
  passwordHash: string;

  @Column({collation: 'C.utf8'})
  email: string;
  //TODO: Вынести в абстрактную сущность
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'userId',
  })
  user: User;
}
