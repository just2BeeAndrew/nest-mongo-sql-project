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
    const blog = await this.blogsRepository.update(command.id, command.dto);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: "Not Found",
        extensions: [{message: "Blog not found", key: "blog"}]
      });
    }
    return true
  }
}
