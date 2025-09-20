import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';

export class FindAllBlogsQuery {
  constructor(public query: FindBlogsQueryParams) {}
}

@QueryHandler(FindAllBlogsQuery)
export class FindAllBlogsQueryHandler
  implements IQueryHandler<FindAllBlogsQuery, PaginatedViewDto<BlogsViewDto[]>>
{
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ query }): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    return this.blogsQueryRepository.findAllBlogs(query);
  }
}
