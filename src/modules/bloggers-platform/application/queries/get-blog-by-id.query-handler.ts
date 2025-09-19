import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';

export class GetBlogByIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler
  implements IQueryHandler<GetBlogByIdQuery, BlogsViewDto> {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: GetBlogByIdQuery): Promise<BlogsViewDto> {
    return this.blogsQueryRepository.findBlogById(query.id)
  }
}
