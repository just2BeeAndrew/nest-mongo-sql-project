import { UpdateBlogsInputDto } from '../../api/input-dto/update-blogs.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: UpdateBlogsInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand) {
    const blog = await this.blogsRepository.findById(command.id);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Blog not found', field: 'blog' }],
      });
    }

    blog.updateBlog(command.dto);

    await this.blogsRepository.saveBlog(blog);
  }
}
