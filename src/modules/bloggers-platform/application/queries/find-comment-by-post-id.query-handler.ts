import { FindCommentsByPostIdQueryParams } from '../../api/input-dto/find-comments-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';

export class FindCommentByPostIdQuery {
  constructor(
    public postId: string,
    public query: FindCommentsByPostIdQueryParams,
    public userId?: string | null,
  ) {}
}

@QueryHandler(FindCommentByPostIdQuery)
export class FindCommentsByPostIdQueryHandler
  implements
    IQueryHandler<FindCommentByPostIdQuery, PaginatedViewDto<CommentsViewDto[]>>
{
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(
    query: FindCommentByPostIdQuery,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const post = await this.postsRepository.findById(query.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Post not found', field: 'post' }],
      });
    }

    return await this.commentsQueryRepository.findCommentsByPostId(
      query.postId,
      query.query,
      query.userId ?? null,
    );
  }
}
