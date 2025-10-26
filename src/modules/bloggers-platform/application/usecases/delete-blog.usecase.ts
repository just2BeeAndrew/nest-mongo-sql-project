import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand) {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension:[{message:"Blog not found", field:"blogId"}],
      });
    }

    blog.softDelete();

    await this.blogsRepository.saveBlog(blog);
  }
}
