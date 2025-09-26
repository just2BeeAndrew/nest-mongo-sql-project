import { FindPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';

export class FindAllPostsQuery {
  constructor(public query: FindPostsQueryParams) {}
}

@QueryHandler(FindAllPostsQuery)
export class FindAllPostsQueryHandler
  implements IQueryHandler<FindAllPostsQuery, PaginatedViewDto<PostsViewDto[]>>
{
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute(
    query: FindAllPostsQuery,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return await this.postsQueryRepository.findAllPosts(query.query);
  }
}
