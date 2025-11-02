import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { User } from '../../../user-accounts/domain/entities/user.entity';
import { LikesInfo } from './likes-info';
import { CommentStatus } from './comment-status.entity';

@Entity('Comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ type: 'uuid' })
  postId: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => LikesInfo, (likes) => likes.comment, { cascade: true })
  likesInfo: LikesInfo;

  @OneToMany(() => CommentStatus, (commentStatus) => commentStatus.comment)
  commentStatus: CommentStatus[];

  static create(content: string, post: Post, user: User) {
    const comment = new Comment();

    comment.content = content;
    comment.postId = post.id;
    comment.userId = user.id;

    comment.likesInfo = LikesInfo.create();

    return comment;
  }
}
