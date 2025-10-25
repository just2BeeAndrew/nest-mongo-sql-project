import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { Blog } from '../domain/entities/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectDataSource() private dataSource: DataSource) {}

  async saveBlog(blog: Blog): Promise<Blog> {
    return this.blogRepository.save(blog);
  }

  async update(id: string, dto: UpdateBlogDto) {
    return  await this.dataSource.query(
      `
      UPDATE "Blogs"
      SET name         = $1,
          description  = $2,
          "websiteUrl" = $3,
          "updatedAt" = NOW()
      WHERE id = $4
        AND "deletedAt" IS NULL
      RETURNING id
    `,
      [dto.name, dto.description, dto.websiteUrl, id],
    );
  }

  async softDeleteBlog(id: string) {
    return await this.dataSource.query(
      `
        UPDATE "Blogs"
        SET "deletedAt" = NOW()
        WHERE id = $1
          AND "deletedAt" IS NULL
        RETURNING id`,
      [id],
    );
  }

  async findById(id: string) {
    const blog = await this.dataSource.query(
      `
        SELECT *
        FROM "Blogs"
        WHERE id = $1
          AND "deletedAt" IS NULL;
      `,
      [id],
    );

    return blog[0] || null;
  }

}
