import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';

@Entity('LikesInfo')
export class LikesInfo {
  @PrimaryColumn()
  commentId: string;

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'int', default: 0 })
  dislikesCount: number;

  @OneToOne(() => Comment)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  static create() {
    const likesInfo = new LikesInfo();

    likesInfo.likesCount = 0;
    likesInfo.dislikesCount = 0;

    return likesInfo;
  }
}