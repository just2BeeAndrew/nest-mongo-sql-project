import { Injectable } from '@nestjs/common';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { LikeStatus } from '../../../../core/dto/like-status';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FindCommentsByPostIdQueryParams } from '../../api/input-dto/find-comments-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Comment } from '../../domain/entities/comment.entity';
import { CommentStatus } from '../../domain/entities/comment-status.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentStatus)
    private readonly commentStatusRepository: Repository<CommentStatus>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findById(
    id: string,
    status: LikeStatus,
  ): Promise<CommentsViewDto | null> {
    const comment = await this.commentRepository
      .createQueryBuilder('c')
      .leftJoin('c.likesInfo', 'l')
      .leftJoin('c.user', 'u')
      .select([
        'c.id AS id',
        'c.content AS content',
        'c.userId AS "userId"',
        'u.login AS "userLogin"',
        'l.likesCount AS "likesCount"',
        'l.dislikesCount AS "dislikesCount"',
      ])
      .where('c.id = :id', { id })
      .andWhere('c.deletedAt IS NULL')
      .getRawOne();

    if (!comment) return null;

    return CommentsViewDto.mapToView(comment, status);
  }

  async findCommentsByPostId(
    postId: string,
    query: FindCommentsByPostIdQueryParams,
    userId: string | null,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const sortDirection = query.sortDirection.toUpperCase() as 'ASC' | 'DESC';

    enum SortByEnum {
      createdAt = 'c.createdAt',
      userLogin = 'u.login',
    }
    const sortBy = SortByEnum[query.sortBy] || SortByEnum.createdAt;

    const comments = await this.commentRepository
      .createQueryBuilder('c')
      .leftJoin('c.likesInfo', 'l')
      .leftJoin('c.user', 'u')
      .select([
        'c.id AS id',
        'c.content AS content',
        'c.userId AS "userId"',
        'u.login AS "userLogin"',
        'c.createdAt AS "createdAt"',
        'l.likesCount AS "likesCount"',
        'l.dislikesCount AS "dislikesCount"',
      ])
      .where('c.postId = :postId ', { postId })
      .andWhere('c.deletedAt IS NULL')
      .orderBy(sortBy, sortDirection)
      .limit(query.pageSize)
      .offset(query.calculateSkip())
      .getRawMany();

    const totalCountResult = await this.commentRepository
      .createQueryBuilder('c')
      .select('COUNT(*)', 'count')
      .where('c.deletedAt IS NULL')
      .andWhere('c.postId = :postId ', { postId })
      .getRawOne();

    const totalCount = parseInt(totalCountResult?.count || '0', 10);

    const commentIds = comments.map((comment) => comment.id);

    let statusMap = new Map<string, LikeStatus>();

    if (userId) {
      const statuses = await this.commentStatusRepository
        .createQueryBuilder('cs')
        .select(['cs.commentid AS "commentId" ', 'cs.status AS status'])
        .where('cs.userId AS "userId"', { userId })
        .andWhere('cs.commentId = ANY(:commentId', { commentIds })
        .getRawMany();

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
