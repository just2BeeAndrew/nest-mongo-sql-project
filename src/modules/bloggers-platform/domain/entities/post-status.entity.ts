import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { LikeStatus } from '../../../../core/dto/like-status';
import { User } from '../../../user-accounts/domain/entities/user.entity';
import { CreateStatusDto } from '../../dto/create-status.dto';

@Entity('PostStatus')
export class PostStatus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  postId: string;

  @Column({ type: 'text' })
  status: LikeStatus;

  @ManyToOne(() => User, (user) => user.postStatus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  static create(body: CreateStatusDto, user: User): PostStatus {
    const postStatus = new PostStatus();
    postStatus.postId = body.postId;
    postStatus.status = body.status;
    postStatus.userId = user.id;

    return postStatus;
  }

  update(newStatus: LikeStatus) {
    this.status = newStatus;
  }
}
