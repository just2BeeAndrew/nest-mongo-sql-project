import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CreateSessionDomainDto } from '../dto/create-session.domain.dto';

@Entity('Session')
export class Session {
  @PrimaryColumn({ type: 'uuid' })
  deviceId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  ip: string;

  @Column({ type: 'timestamptz' })
  iat: Date;

  @Column({ type: 'timestamptz' })
  exp: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  userId:string

  static create(dto: CreateSessionDomainDto, user: User): Session {
    const session = new Session();
    session.deviceId = dto.deviceId;
    session.title = dto.title;
    session.ip = dto.ip;
    session.iat = new Date(dto.iat * 1000);
    session.exp = new Date(dto.exp * 1000);
    session.user = user

    return session;
  }
}
