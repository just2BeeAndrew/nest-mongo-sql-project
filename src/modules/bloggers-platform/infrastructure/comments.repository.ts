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

  async create(body: CreateCommentDto) {
    const comment = await this.dataSource.query(
      `
      WITH insert_comment AS (
        INSERT INTO "Comments" (id, content, "createdAt")
          VALUES (gen_random_uuid(), $1, NOW())
          RETURNING id),
           insert_commentator_info AS (
             INSERT
               INTO "CommentatorInfo" (id, "userId", "userLogin")
                 SELECT id, $2, $3
                 FROM "Comments"
                 RETURNING id)
      INSERT
      INTO "LikesInfo" (id, "likesCount", "dislikesCount")
      SELECT id, 0, 0
      FROM "Comments"
      RETURNING id
    `,
      [body.content, body.userId, body.userLogin],
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
