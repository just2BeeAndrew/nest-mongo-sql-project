import { Injectable } from '@nestjs/common';
import { PostRaw, PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { LikeStatus } from '../../../../core/dto/like-status';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findAll(
    query: FindPostsQueryParams,
    userId: string | null,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    console.log('query', query);
    const posts = await this.getPosts(query, null);
    const totalCount = await this.getPostsCount(null);
    const postIds = posts.map((post) => post.id);

    const newestLikes = await this.getNewestLikes(postIds);
    const likesMap = this.buildLikesMap(newestLikes);
    const statusMap = await this.getUserStatusMap(userId, postIds);

    return this.buildPaginatedResponse(
      posts,
      totalCount,
      query,
      statusMap,
      likesMap,
    );
  }

  async findById(id: string, status: LikeStatus): Promise<PostsViewDto | null> {
    const post = await this.postsRepository
      .createQueryBuilder('p')
      .leftJoin('p.blog', 'b')
      .leftJoin('p.extendedLikesInfo', 'el')
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
      .where('p.id = :id', { id })
      .andWhere('p.deletedAt IS NULL ')
      .getRawOne<PostRaw>();

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
    const posts = await this.getPosts(query, blogId);
    const totalCount = await this.getPostsCount(blogId);
    const postIds = posts.map((post) => post.id);

    const newestLikes = await this.getNewestLikes(postIds);
    const likesMap = this.buildLikesMap(newestLikes);
    const statusMap = await this.getUserStatusMap(userId, postIds);

    return this.buildPaginatedResponse(
      posts,
      totalCount,
      query,
      statusMap,
      likesMap,
    );
  }

  private async getPosts(query: FindPostsQueryParams, blogId: string | null) {
    enum SortByEnum {
      title = 'p.title',
      blogName = 'b.name',
      createdAt = 'p.createdAt',
    }

    const sortBy = SortByEnum[query.sortBy] || SortByEnum.createdAt;

    const sortDirection = query.sortDirection.toUpperCase() as 'ASC' | 'DESC';

    const queryBuilder = this.postsRepository
      .createQueryBuilder('p')
      .innerJoin('p.blog', 'b')
      .innerJoin('p.extendedLikesInfo', 'el')
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
      .where('p.deletedAt IS NULL')

    if (blogId !== null) {
      queryBuilder.andWhere('p.blogId = :blogId', { blogId });
    }

    return queryBuilder
      .orderBy(sortBy, sortDirection)
      .limit(query.pageSize)
      .offset(query.calculateSkip())
      .getRawMany();
  }

  private async getPostsCount(blogId: string | null): Promise<number> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('p')
      .select('COUNT(*)', 'count')
      .where('p.deletedAt IS NULL');

    if (blogId !== null) {
      queryBuilder.andWhere('p.blogId = :blogId', { blogId });
    }

    const result = await queryBuilder.getRawOne();
    return parseInt(result?.count || '0', 10);
  }

  private async getNewestLikes(postIds: string[]): Promise<any[]> {
    const subNewestLikes = this.postStatusRepository
      .createQueryBuilder('ps')
      .leftJoin('ps.user', 'u')
      .leftJoin('u.accountData', 'ad')
      .select('ps.postId', 'postId')
      .addSelect('ps.userId', 'userId')
      .addSelect('ad.login', 'login')
      .addSelect('ps.createdAt', 'addedAt')
      .addSelect(
        'CAST(ROW_NUMBER() OVER (PARTITION BY ps."postId" ORDER BY ps."createdAt" DESC) AS INT)',
        'likeDetails',
      )
      .where('ps.postId = ANY(:postIds)', { postIds })
      .andWhere('ps.status = :status', { status: 'Like' });

    return this.dataSource
      .createQueryBuilder()
      .select('t."postId"', 'postId')
      .addSelect('t."userId"', 'userId')
      .addSelect('t.login', 'login')
      .addSelect('t."addedAt"', 'addedAt')
      .from(`(${subNewestLikes.getQuery()})`, 't')
      .where('t."likeDetails" <= 3')
      .setParameters(subNewestLikes.getParameters())
      .getRawMany();
  }

  private buildLikesMap(newestLikes: any[]): Map<string, LikeDetails[]> {
    const likesMap = new Map<string, LikeDetails[]>();

    for (const like of newestLikes) {
      if (!likesMap.has(like.postId)) {
        likesMap.set(like.postId, []);
      }
      likesMap
        .get(like.postId)!
        .push(new LikeDetails(new Date(like.addedAt), like.userId, like.login));
    }

    return likesMap;
  }

  private async getUserStatusMap(
    userId: string | null,
    postIds: string[],
  ): Promise<Map<string, LikeStatus>> {
    if (!userId) {
      return new Map<string, LikeStatus>();
    }

    const statuses = await this.postStatusRepository
      .createQueryBuilder('ps')
      .select(['ps.postId AS "postId"', 'ps.status AS status'])
      .where('ps.userId = :userId', { userId })
      .andWhere('ps.postId = ANY(:postIds)', { postIds })
      .getRawMany();

    return statuses.reduce((map, status) => {
      map.set(status.postId, status.status);
      return map;
    }, new Map<string, LikeStatus>());
  }

  private buildPaginatedResponse(
    posts: any[],
    totalCount: number,
    query: FindPostsQueryParams,
    statusMap: Map<string, LikeStatus>,
    likesMap: Map<string, LikeDetails[]>,
  ): PaginatedViewDto<PostsViewDto[]> {
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
