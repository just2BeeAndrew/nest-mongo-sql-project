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

  //обратная связь с AccountData
  @OneToOne(() => AccountData, (acccountData) =>acccountData.user, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  accountData: AccountData;

  //обратная связь с EmailConfirmation
  @OneToOne(() => EmailConfirmation, (emailConfirmation) =>emailConfirmation.user, {
    cascade: true,
    onDelete: 'CASCADE'
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @BeforeInsert()
  setId() {
    this.userId = this.user.id;
  }
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

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @BeforeInsert()
  setId() {
    this.userId = this.user.id;
  }
}
