import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { Post } from './post.entity';

@Entity('ExternalLikesInfo')
export class ExtendedLikesInfo extends BaseEntity {
  @PrimaryColumn()
  postId: string;

  @Column({ type: Number, default: 0 })
  likesCount: number;

  @Column({ type: Number, default: 0 })
  dislikesCount: number;

  @OneToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: Post;

  static create(){
    const extendedLikesInfo = new ExtendedLikesInfo();

    extendedLikesInfo.likesCount = 0;
    extendedLikesInfo.dislikesCount = 0;

    return extendedLikesInfo;
  }
}
