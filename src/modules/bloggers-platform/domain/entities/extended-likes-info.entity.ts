import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('ExternalLikesInfo')
export class ExtendedLikesInfo {
  @PrimaryColumn()
  postId: string;

  @Column({ type: Number, default: 0 })
  likesCount: number;

  @Column({ type: Number, default: 0 })
  dislikesCount: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  public deletedAt: Date;

  @OneToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: Post;

  static create() {
    const extendedLikesInfo = new ExtendedLikesInfo();

    extendedLikesInfo.likesCount = 0;
    extendedLikesInfo.dislikesCount = 0;

    return extendedLikesInfo;
  }
}
