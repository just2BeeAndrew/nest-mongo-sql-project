import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class FindBlogByIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(FindBlogByIdQuery)
export class FindBlogByIdQueryHandler
  implements IQueryHandler<FindBlogByIdQuery, BlogsViewDto>
{
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: FindBlogByIdQuery): Promise<BlogsViewDto> {
    const blog = await this.blogsQueryRepository.findBlogById(query.id);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{message: "Blog not found", key: "blog"}]
      });
    }

    return blog;
  }
}
