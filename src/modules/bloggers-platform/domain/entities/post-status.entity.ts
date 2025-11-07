import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { LikeStatus } from '../../../../core/dto/like-status';
import { User } from '../../../user-accounts/domain/entities/user.entity';
import { Post } from './post.entity';

@Entity('PostStatus')
export class PostStatus extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.postStatus)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'text' })
  status: LikeStatus;

  @ManyToOne(() => User, (user) => user.postStatus)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  static create(status: LikeStatus, post: Post, user: User): PostStatus {
    const postStatus = new PostStatus();

    postStatus.userId = user.id;
    postStatus.postId = post.id;
    postStatus.status = status;

    return postStatus;
  }

  update(newStatus: LikeStatus) {
    this.status = newStatus;
  }
}
