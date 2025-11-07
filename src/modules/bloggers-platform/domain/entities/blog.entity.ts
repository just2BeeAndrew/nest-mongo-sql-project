import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { Post } from './post.entity';

@Entity('Blog')
export class Blog extends BaseEntity {
  @Column({ type: 'text', collation: 'C.utf8' })
  public name: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'text', name: 'websiteUrl' })
  public websiteUrl: string;

  @Column({ type: 'boolean', name: 'isMembership', default: false })
  public isMembership: boolean;

  @OneToMany(() => Post, (posts) => posts.blog)
  posts: Post[];

  static create(dto: CreateBlogDto) {
    const blog = new Blog();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return blog;
  }

  updateBlog(dto: UpdateBlogDto) {
    if (this.name !== dto.name) this.name = dto.name;
    if (this.description !== dto.description)
      this.description = dto.description;
    if (this.websiteUrl !== dto.websiteUrl) this.websiteUrl = dto.websiteUrl;
  }

  softDelete() {
    if (this.deletedAt !== null) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
      });
    }
    this.deletedAt = new Date();
  }
}
