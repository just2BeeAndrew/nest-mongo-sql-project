import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: string) {
    const post = await this.dataSource.query(
      `
        SELECT *
        FROM "Posts" p
               JOIN "ExtendedLikesInfo" e ON p.id = e.id
        WHERE p.id = $1
          AND "deletedAt" IS NULL
        `,
      [id],
    );

    return post[0] || null;
  }

  async create(body: CreatePostDto) {
    const post = await this.dataSource.query(
      `
      WITH insert_post AS (
        INSERT INTO "Posts" (id, title, "shortDescription", content, "blogId", "blogName", "createdAt")
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING id)
      INSERT
      INTO "ExtendedLikesInfo" (id, "likesCount", "dislikesCount")
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
    return await this.dataSource.query(
      `
        UPDATE "Posts"
        SET title              = $1,
            "shortDescription" = $2,
            content            = $3,
            "updatedAt"        = NOW()
        WHERE id = $4
          AND "deletedAt" IS NULL
        RETURNING id
      `,
      [
        body.body.title,
        body.body.shortDescription,
        body.body.content,
        body.postId,
      ],
    );
  }

  async updateCounters(likesCount: number, dislikesCount: number, id: string) {
    await this.dataSource.query(
      `
        UPDATE "ExtendedLikesInfo" e
        SET "likesCount"   = $1,
            "dislikesCount" = $2
        FROM "Posts" p
        WHERE p.id = e.id
          AND p.id = $3
          AND p."deletedAt" IS NULL
      `,
      [likesCount, dislikesCount, id],
    );
  }

  async softDelete(id: string) {
    return await this.dataSource.query(
      `
        UPDATE "Posts"
        SET "deletedAt" = NOW()
        WHERE id = $1
          AND "deletedAt" IS NULL
        RETURNING id;
      `,
      [id],
    );
  }
}
