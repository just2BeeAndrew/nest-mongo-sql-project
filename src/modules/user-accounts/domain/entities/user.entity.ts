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

  @OneToOne(() => User, { cascade: true })
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

  @Column({ nullable: true,})
  confirmationCode: string;

  @Column({ nullable: true})
  recoveryCode: string;

  @Column({type: 'timestamptz'})
  issuedAt: Date;

  @Column({type: 'timestamptz'})
  expirationTime: Date;

  @Column({default: false})
  isConfirmed: boolean;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @BeforeInsert()
  setId() {
    this.userId = this.user.id;
  }
}
