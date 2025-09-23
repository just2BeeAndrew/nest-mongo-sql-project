import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { LikeStatus } from '../../../../core/dto/like-status';

export class FindPostByIdQuery {
  constructor(public id: string,
              public status: LikeStatus) {}
}

@QueryHandler(FindPostByIdQuery)
export class FindBlogByIdQueryHandler
  implements IQueryHandler<FindPostByIdQuery, PostsViewDto>
{
  constructor(private readonly blogsQueryRepository: PostsQueryRepository) {}

  async execute(query: FindPostByIdQuery): Promise<PostsViewDto> {
    const post = await this.blogsQueryRepository.findPostById(query.id, query.status );
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{message: "post not found", key: "post"}]
      });
    }

    return post;
  }
}