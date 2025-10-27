import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { CreatePostDto } from '../../dto/create-post.dto';
import { ExtendedLikesInfo } from './extended-likes-info.entity';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 30 })
  public title: string;

  @Column({ type: 'varchar', length: 100 })
  public shortDescription: string;

  @Column({ type: 'varchar', length: 1000 })
  public content: string;

  @OneToOne(() => ExtendedLikesInfo, (extendedLikes) => extendedLikes.post, {
    cascade: true,
  })
  extendedLikesInfo: ExtendedLikesInfo;

  @ManyToOne(() => Blog, (blog) => blog.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId', referencedColumnName: 'id' })
  blog: Blog;

  @Column({ type: 'uuid' })
  blogId: string;

  static create(dto: CreatePostDto, blog: Blog) {
    const post = new Post();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blog = blog;

    return post;
  }

  update(dto: UpdatePostDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
  }

  softDelete() {
    if (this.deletedAt !== null) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        extension: [{message: "Post already deleted."}],
      });
    }
    this.deletedAt = new Date();
  }
}