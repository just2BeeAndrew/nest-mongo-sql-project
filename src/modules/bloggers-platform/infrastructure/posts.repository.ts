import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(body: CreatePostDto) {
    const post = await this.dataSource.query(
      `
      WITH insert_post AS (
        INSERT INTO "Posts" (id, title, "shortDescription", content, "blogId", "blogName", "createdAt")
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING id)
      INSERT
      INTO "ExtendedLikesInfo" (id, "likesCount", "dislikeCount")
      SELECT id, 0, 0
      FROM insert_post
      RETURNING id;
    `,
      [
        body.title,
        body.shortDescription,
        body.content,
        body.blogId,
        body.blogName,
      ],
    );
    return post[0].id;
  }

  async update(body: UpdatePostDto) {
    const post = await this.dataSource.query(
      `
        UPDATE "Posts"
        SET title              = $1,
            "shortDescription" = $2,
            content            = $3,
            "updatedAt"        = NOW()
        WHERE id = $4
          AND "blogId" = $5
          AND "deletedAt" IS NULL
      `,
      [
        body.body.title,
        body.body.shortDescription,
        body.body.content,
        body.postId,
        body.blogId,
      ],
    );
    return post[0] || null;
  }
}
