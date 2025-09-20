import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';

export class FindBlogByIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(FindBlogByIdQuery)
export class FindBlogByIdQueryHandler
  implements IQueryHandler<FindBlogByIdQuery, BlogsViewDto> {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: FindBlogByIdQuery): Promise<BlogsViewDto> {
    return this.blogsQueryRepository.findBlogById(query.id)
  }
}
