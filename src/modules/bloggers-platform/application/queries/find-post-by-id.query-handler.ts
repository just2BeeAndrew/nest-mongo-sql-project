import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { LikeStatus } from '../../../../core/dto/like-status';
import { PostStatusRepository } from '../../infrastructure/post-status.repository';

export class FindPostByIdQuery {
  constructor(
    public postId: string,
    public userId?: string | null,
  ) {}
}

@QueryHandler(FindPostByIdQuery)
export class FindPostByIdQueryHandler
  implements IQueryHandler<FindPostByIdQuery, PostsViewDto>
{
  constructor(
    private readonly postStatusRepository: PostStatusRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(query: FindPostByIdQuery): Promise<PostsViewDto> {
    let userStatus: LikeStatus = LikeStatus.None;

    if (query.userId) {
      const status = await this.postStatusRepository.find(
        query.userId,
        query.postId,
      );

      userStatus = status ? status.status : LikeStatus.None;
    }

    const post = await this.postsQueryRepository.findById(query.postId, userStatus);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'post not found', field: 'post' }],
      });
    }

    return post;
  }
}
