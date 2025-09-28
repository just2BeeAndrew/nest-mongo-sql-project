import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  async create(body: CreateCommentDto){
    const comment = await this.datasource.query(`
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
    `,[body.content,body.userId, body.userLogin ]);

      return comment[0].id
  }
}
