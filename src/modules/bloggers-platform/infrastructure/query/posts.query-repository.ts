import { Injectable } from '@nestjs/common';
import { PostRaw, PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { LikeStatus } from '../../../../core/dto/like-status';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { FindPostsQueryParams } from '../../api/input-dto/find-posts-query-params.input-dto';
import { LikeDetails } from '../../dto/like-details';
import { Post } from '../../domain/entities/post.entity';
import { PostStatus } from '../../domain/entities/post-status.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(PostStatus)
    private postStatusRepository: Repository<PostStatus>,
  ) {}

  async findAll(
    query: FindPostsQueryParams,
    userId: string | null,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const orderBy = `p."${query.sortBy}" ${query.sortDirection}`;

    const posts = await this.dataSource.query(
      `
        SELECT p.id,
               p.title,
               p."shortDescription",
               p.content,
               p."blogId",
               p."blogName",
               p."createdAt",
               e."likesCount",
               e."dislikesCount"
        FROM "Posts" p
               JOIN "ExtendedLikesInfo" e ON p.id = e.id
        ORDER BY ${orderBy}
        LIMIT $1 OFFSET $2
      `,
      [query.pageSize, query.calculateSkip()],
    );

    const totalCountResult = await this.dataSource.query(
      `
      SELECT COUNT(*) as count
      FROM "Posts"
    `,
    );

    const totalCount = parseInt(totalCountResult[0]?.count || '0', 10);

    const postIds = posts.map((post) => post.id);

    const newestLikes = await this.dataSource.query(
      `
      SELECT t."categoryId" as "postId", t."userId", t."login", t."addedAt"
      FROM (SELECT "categoryId",
                   "userId",
                   "login",
                   "addedAt",
                   ROW_NUMBER() OVER (PARTITION BY "categoryId" ORDER BY "addedAt" DESC) AS likeDetails
            FROM "Statuses"
            WHERE "categoryId" = ANY ($1)
              AND category = 'Post'
              AND status = 'Like') t
      WHERE t.likeDetails <=3
    `,
      [postIds],
    );

    const likesMap = new Map<string, LikeDetails[]>();
    for (const like of newestLikes) {
      if (!likesMap.has(like.postId)) likesMap.set(like.postId, []);
      likesMap
        .get(like.postId)!
        .push(new LikeDetails(new Date(like.addedAt), like.userId, like.login));
    }

    let statusMap = new Map<string, LikeStatus>();
    if (userId) {
      const statuses = await this.dataSource.query(
        `
      SELECT "categoryId", "status"
      FROM "Statuses"
      WHERE "userId" = $1
        AND "categoryId" = ANY($2)
        AND category = 'Post'
      `,
        [userId, postIds],
      );

      statusMap = statuses.reduce((map, status) => {
        map.set(status.categoryId, status.status);
        return map;
      }, new Map<string, LikeStatus>());
    }

    const items = posts.map((post) =>
      PostsViewDto.mapToView(
        post,
        statusMap.get(post.id) ?? LikeStatus.None,
        likesMap.get(post.id) ?? [],
      ),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findById(id: string, status: LikeStatus): Promise<PostsViewDto | null> {
    const post = await this.postsRepository
      .createQueryBuilder('p')
      .leftJoin('p.blog', 'b')
      .leftJoin('p.extendedLikes', 'el')
      .select([
        'p.id AS id',
        'p.title AS title',
        'p.shortDescription AS "shortDescription"',
        'p.content AS content',
        'p.blogId AS "blogId"',
        'b.name AS "blogName"',
        'p.createdAt AS "createdAt"',
        'el.likesCount AS "likesCount"',
        'el.dislikesCount AS "dislikesCount"',
      ])
      .where('p.id = :id', {id})
      .andWhere('p.deletedAt IS NULL ')
      .getRawOne<PostRaw>()

    if (!post) return null;

    const newestLikesRaw = await this.postStatusRepository
      .createQueryBuilder('ps')
      .leftJoin('ps.user', 'u')
      .leftJoin('u.accountData', 'ad')
      .select([
        'ps.createdAt AS "addedAt"',
        'u.id AS "userId"',
        'ad.login AS login',
      ])
      .where('ps.postId=:id', { id })
      .andWhere('ps.status = :status', { status: 'Like' })
      .orderBy('ps.createdAt', 'DESC')
      .limit(3)
      .getRawMany();

    const newestLikes = newestLikesRaw.map(
      (like) =>
        new LikeDetails(new Date(like.addedAt), like.userId, like.login),
    );

    return PostsViewDto.mapToView(post, status, newestLikes);
  }

  async findPostsByBlogId(
    blogId: string,
    query: FindPostsQueryParams,
    userId: string | null,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const posts = await this.dataSource.query(
      `
        SELECT p.id,
               p.title,
               p."shortDescription",
               p.content,
               p."blogId",
               p."blogName",
               p."createdAt",
               e."likesCount",
               e."dislikesCount"
        FROM "Posts" p
               JOIN "ExtendedLikesInfo" e ON p.id = e.id
        WHERE p."blogId" = $1 AND "deletedAt" IS NULL
        ORDER BY "${query.sortBy}" ${query.sortDirection}
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

    const postIds = posts.map((post) => post.id);

    const newestLikes = await this.dataSource.query(
      `
      SELECT t."categoryId" as "postId", t."userId", t."login", t."addedAt"
      FROM (SELECT "categoryId",
                   "userId",
                   "login",
                   "addedAt",
                   ROW_NUMBER() OVER (PARTITION BY "categoryId" ORDER BY "addedAt" DESC) AS likeDetails
            FROM "Statuses"
            WHERE "categoryId" = ANY ($1)
              AND category = 'Post'
              AND status = 'Like') t
      WHERE t.likeDetails <=3
    `,
      [postIds],
    );

    const likesMap = new Map<string, LikeDetails[]>();
    for (const like of newestLikes) {
      if (!likesMap.has(like.postId)) likesMap.set(like.postId, []);
      likesMap
        .get(like.postId)!
        .push(new LikeDetails(new Date(like.addedAt), like.userId, like.login));
    }

    let statusMap = new Map<string, LikeStatus>();
    if (userId) {
      const statuses = await this.dataSource.query(
        `
      SELECT "categoryId", "status"
      FROM "Statuses"
      WHERE "userId" = $1
        AND "categoryId" = ANY($2)
        AND category = 'Post'
      `,
        [userId, postIds],
      );

      statusMap = statuses.reduce((map, status) => {
        map.set(status.categoryId, status.status);
        return map;
      }, new Map<string, LikeStatus>());
    }

    const items = posts.map((post) =>
      PostsViewDto.mapToView(
        post,
        statusMap.get(post.id) ?? LikeStatus.None,
        likesMap.get(post.id) ?? [],
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
