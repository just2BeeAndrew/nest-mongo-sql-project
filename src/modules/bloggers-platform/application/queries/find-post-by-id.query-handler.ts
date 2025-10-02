import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { LikeStatus } from '../../../../core/dto/like-status';
import { Category } from '../../../../core/dto/category';
import { StatusRepository } from '../../infrastructure/status.repository';

export class FindPostByIdQuery {
  constructor(
    public id: string,
    public userId?: string | null,
  ) {}
}

@QueryHandler(FindPostByIdQuery)
export class FindPostByIdQueryHandler
  implements IQueryHandler<FindPostByIdQuery, PostsViewDto>
{
  constructor(
    private readonly statusRepository: StatusRepository,
    private readonly blogsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(query: FindPostByIdQuery): Promise<PostsViewDto> {
    let userStatus: LikeStatus = LikeStatus.None;

    if (query.userId) {
      const status = await this.statusRepository.find(
        query.userId,
        query.id,
        Category.Post,
      );
      userStatus = status ? status.status : LikeStatus.None;
    }

    const post = await this.blogsQueryRepository.findById(
      query.id,
      userStatus,
    );
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{ message: 'post not found', key: 'post' }],
      });
    }

    return post;
  }
}
