import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity("EmailConfirmation")
export class EmailConfirmation {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'text', nullable: true })
  confirmationCode: string | null;

  @Column({ type: 'text', nullable: true })
  recoveryCode: string | null;

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
