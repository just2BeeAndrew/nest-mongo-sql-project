import { Injectable } from '@nestjs/common';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { LikeStatus } from '../../../../core/dto/like-status';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FindCommentsByPostIdQueryParams } from '../../api/input-dto/find-comments-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(
    id: string,
    status: LikeStatus,
  ): Promise<CommentsViewDto | null> {
    const comment = await this.dataSource.query(
      `
        SELECT c.id,
               c.content,
               c."createdAt",
               ci."userId",
               ci."userLogin",
               l."likesCount",
               l."dislikesCount"
        FROM "Comments" c
               JOIN "CommentatorInfo" ci ON c.id = ci.id
               LEFT JOIN "LikesInfo" l ON c.id = l.id
        WHERE c.id = $1
          AND c."deletedAt" IS NULL
      `,
      [id],
    );

    if (comment.length === 0) return null;

    return CommentsViewDto.mapToView(comment[0], status);
  }

  async findCommentsByPostId(
    postId: string,
    query: FindCommentsByPostIdQueryParams,
    userId: string | null,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const comments = await this.dataSource.query(
      `
        SELECT c.id,
               c.content,
               ci."userId",
               ci."userLogin",
               c."createdAt",
               li."likesCount",
               li."dislikesCount"
        FROM "Comments" c
               JOIN "CommentatorInfo" ci ON c.id = ci.id
               LEFT JOIN "LikesInfo" li ON c.id = li.id
        WHERE c."postId" = $1
          AND c."deletedAt" IS NULL
        ORDER BY "${query.sortBy}" ${query.sortDirection}
        LIMIT $2 OFFSET $3
      `,
      [postId, query.pageSize, query.calculateSkip()],
    );

    const totalCountResult = await this.dataSource.query(
      `
      SELECT COUNT(*) as count
      FROM "Comments"
      WHERE "postId" = $1
        AND "deletedAt" IS NULL
    `,
      [postId],
    );

    const totalCount = parseInt(totalCountResult[0]?.count || '0', 10);

    const commentIds = comments.map((comment) => comment.id);
    console.log("commentsIds",commentIds);

    let statusMap = new Map<string, LikeStatus>();
    if (userId) {
      const statuses = await this.dataSource.query(
        `
      SELECT "categoryId", "status"
      FROM "Statuses"
      WHERE "userId" = $1
        AND "categoryId" = ANY($2)
        AND category = 'Comment'
      `,
        [userId, commentIds],
      );

      console.log("statuses",statuses);

      statusMap = statuses.reduce((map, status) => {
        map.set(status.categoryId, status.status);
        return map;
      }, new Map<string, LikeStatus>());
    }

    const items = comments.map((comment) =>
      CommentsViewDto.mapToView(
        comment,
        statusMap.get(comment.id) ?? LikeStatus.None,
      ),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
