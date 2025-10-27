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
export class DeletePostByBlogIdUseCase
  implements ICommandHandler<DeletePostCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: DeletePostCommand) {
    const blog = await this.blogsRepository.findById(command.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Blog not found', field: 'blog' }],
      });
    }

    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Post not found', field: 'post' }],
      });
    }

    post.softDelete();

    await this.postsRepository.savePost(post)
  }
}
