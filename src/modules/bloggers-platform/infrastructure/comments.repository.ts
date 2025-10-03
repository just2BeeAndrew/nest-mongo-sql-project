import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { DeleteCommentDto } from '../dto/delete-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async isExist(id: string) {
    return await this.dataSource.query(
      `
    SELECT 1 FROM "Comments" WHERE id = $1 LIMIT 1
    `,
      [id],
    );
  }

  async findById(id: string) {
    const comment = await this.dataSource.query(
      `
      SELECT c.id,
             c.content,
             c."createdAt",
             ci."userId",
             ci."userLogin",
             li."likesCount",
             li."dislikesCount"
      FROM "Comments" c
             JOIN "CommentatorInfo" ci ON c.id = ci.id
             LEFT JOIN "LikesInfo" li ON c.id = li.id
      WHERE c.id = $1
        AND c."deletedAt" IS NULL
    `,
      [id],
    );

    return comment[0] || null;
  }

  async create(body: CreateCommentDto) {
    const comment = await this.dataSource.query(
      `
        WITH insert_comment AS (
          INSERT INTO "Comments" (id, "postId", content, "createdAt")
            VALUES (gen_random_uuid(), $1, $2, NOW())
            RETURNING id),
             insert_commentator_info AS (
               INSERT
                 INTO "CommentatorInfo" (id, "userId", "userLogin")
                   SELECT id, $3, $4
                   FROM insert_comment
                   RETURNING id)
        INSERT
        INTO "LikesInfo" (id, "likesCount", "dislikesCount")
        SELECT id, 0, 0
        FROM insert_comment
        RETURNING id
      `,
      [body.postId, body.content, body.userId, body.userLogin],
    );

    return comment[0].id;
  }

  async update(body: UpdateCommentDto) {
    return await this.dataSource.query(
      `
      UPDATE "Comments" c
      SET content     = $1,
          "updatedAt" = NOW()
      FROM "CommentatorInfo" ci
      WHERE c.id = $2
        AND c.id = ci.id
        AND ci."userId" = $3
        AND c."deletedAt" IS NULL
      RETURNING c.id, ci."userId"
    `,
      [body.content, body.commentId, body.userId],
    );
  }

  async updateCounters(likesCount: number, dislikesCount: number, id: string) {
    await this.dataSource.query(
      `
        UPDATE "LikesInfo" li
        SET "likesCount"    = $1,
            "dislikesCount" = $2
        FROM "Comments" c
        WHERE c.id = li.id
          AND c.id = $3
          AND c."deletedAt" IS NULL
        `,
      [likesCount, dislikesCount, id],
    );
  }

  async softDelete(body: DeleteCommentDto) {
    return await this.dataSource.query(
      `
      UPDATE "Comments" c
      SET "deletedAt" = NOW()
      FROM "CommentatorInfo" ci
      WHERE c.id = $1
        AND c.id = ci.id
        AND ci."userId" = $2
        AND c."deletedAt" IS NULL
      RETURNING c.id, ci."userId"
    `,
      [body.commentId, body.userId],
    );
  }
}
