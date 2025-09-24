import { Injectable } from '@nestjs/common';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { LikeStatus } from '../../../../core/dto/like-status';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { FindPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findPostById(
    id: string,
    status: LikeStatus,
  ): Promise<PostsViewDto | null> {
    const post = await this.dataSource.query(
      `
    SELECT * FROM "Posts" p JOIN "ExtendedLikesInfo" e ON p.id = e.id WHERE p.id = $1 AND "deletedAt" IS NULL 
    `,
      [id],
    );

    if (post.length === 0) return null;

    return PostsViewDto.mapToView(post, status);
  }

  async findPostsByBlogId(
    blogId: string,
    query: FindPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const posts = await this.dataSource.query(
      `
        SELECT p.id,
               p.title,
               p."shortDescription",
               p.content,
               p."blogId",
               p."blogName",
               p."createdAt"
        FROM "Posts" p
               JOIN "ExtendedLikesInfo" e ON p.id = e.id
        WHERE p."blogId" = $1 AND "deletedAt" IS NULL
        ORDER BY ${query.sortBy} ${query.sortDirection}
        LIMIT $2
        OFFSET $3
      `,
      [blogId, query.pageSize, query.calculateSkip()],
    );

    const totalCountResult = await this.dataSource.query(
      `
      SELECT COUNT(*) as count
      FROM "Posts"
      WHERE "blogId" = $1
        AND "deletedAt" IS NULL
    `,
      [blogId],
    );

    const totalCount = parseInt(totalCountResult[0]?.count || '0', 10);

    const items = posts.map(PostsViewDto.mapToView, LikeStatus.None);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
