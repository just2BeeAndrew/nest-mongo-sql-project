import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/base.entity';
import { CreateBlogDto } from '../../dto/create-blog.dto';

@Entity('Blog')
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'text', name: 'websiteUrl' })
  public websiteUrl: string;

  @Column({ type: 'boolean', name: 'isMembership', default: false })
  public isMembership: boolean;

  static create(dto: CreateBlogDto) {
    const blog = new Blog();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return blog;
  }
}
