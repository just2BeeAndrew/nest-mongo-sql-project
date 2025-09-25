import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createBlog(dto: CreateBlogDto) {
    const user = await this.dataSource.query(
      `
    INSERT INTO "Blogs" (name, description, "websiteUrl")
    VALUES ($1, $2, $3)
    RETURNING id
    `,
      [dto.name, dto.description, dto.websiteUrl],
    );

    return user[0].id;
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

  async update(id: string, dto: UpdateBlogDto) {
    const blog = await this.dataSource.query(
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

    return blog[0] || null;
  }
}
