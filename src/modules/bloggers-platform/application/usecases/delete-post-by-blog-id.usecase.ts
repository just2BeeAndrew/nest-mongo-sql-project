import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class DeletePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostByBlogIdUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: DeletePostCommand) {
    const blog = await this.blogsRepository.findById(command.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'Blog not found', key: 'blog' }],
      });
    }

    const post = await this.postsRepository.softDelete(command.postId)
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'Post not found', key: 'post' }],
      });
    }
  }
}
