import { UpdatePostInputDto } from '../../api/input-dto/update-post-input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class UpdatePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public body: UpdatePostInputDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostByBlogIdUseCase
  implements ICommandHandler<UpdatePostCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: UpdatePostCommand) {
    const blog = await this.blogsRepository.findById(command.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Blog not found', field: 'blogId' }],
      });
    }

    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Post not found', field: 'postId' }],
      });
    }

    post.update(command.body)

    await this.postsRepository.savePost(post)
  }
}
