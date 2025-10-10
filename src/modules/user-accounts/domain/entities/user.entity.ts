import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => AccountData, (accountData) =>accountData.user, {
    cascade: true
  })
  accountData: AccountData;

  @OneToOne(() => EmailConfirmation, (emailConfirmation) =>emailConfirmation.user, {
    cascade: true,
  })
  emailConfirmation: EmailConfirmation;
}

@Entity()
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

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}

@Entity()
export class EmailConfirmation {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ nullable: true })
  confirmationCode: string | null;

  @Column({ nullable: true })
  recoveryCode: string |null;

  @Column({ type: 'timestamptz' })
  issuedAt: Date;

  @Column({ type: 'timestamptz' })
  expirationTime: Date;

  @Column({ default: false })
  isConfirmed: boolean;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
