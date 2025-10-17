import { FindPostsQueryParams } from '../../api/input-dto/find-posts-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class FindPostsByBlogIdQuery {
  constructor(
    public blogId: string,
    public query: FindPostsQueryParams,
    public userId?: string | null,
  ) {}
}

@QueryHandler(FindPostsByBlogIdQuery)
export class FindPostsByBlogIdQueryHandler
  implements
    IQueryHandler<FindPostsByBlogIdQuery, PaginatedViewDto<PostsViewDto[]>>
{
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute(
    query: FindPostsByBlogIdQuery,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const blog = await this.blogsRepository.findById(query.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extensions: [{ message: 'Blog not found', field: 'blog' }],
      });
    }

    return await this.postsQueryRepository.findPostsByBlogId(
      query.blogId,
      query.query,
      query.userId ?? null,
    );
  }
}
