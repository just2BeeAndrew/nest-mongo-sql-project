import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import  {Comment} from './comment.entity';
import { LikeStatus } from '../../../../core/dto/like-status';
import { User } from '../../../user-accounts/domain/entities/user.entity';

@Entity('CommentStatus')
export class CommentStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(()=>Comment, (comment)=>comment.commentStatus)
  @JoinColumn({name: 'commentId'})
  comment: Comment;

  @Column({ type: 'uuid' })
  commentId: string;

  @Column({ type: 'text' })
  status: LikeStatus;

  @ManyToOne(()=>User, (user)=>user.commentStatus)
  @JoinColumn({name: 'userId'})
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  static create
}