import { Injectable } from '@nestjs/common';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { LikeStatus } from '../../../../core/dto/like-status';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: string, status: LikeStatus): Promise<CommentsViewDto | null> {
    const comment = await this.dataSource.query(
      `
        SELECT c.id,
               c.content,
               c."createdAt"
        FROM "Comments" c
               JOIN "CommentatorInfo" i ON c.id = i.id
               LEFT JOIN "LikesInfo" l ON c.id = l.id
        WHERE c.id = $1
          AND c."deletedAt" IS NULL
      `,
      [id],
    );

    if (comment.length === 0) return null

    return CommentsViewDto.mapToView(comment[0], status);
  }
}
