import { CreatePostInputDto } from '../../api/input-dto/create-post.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { Post } from '../../domain/entities/post.entity';

export class CreatePostByBlogIdCommand {
  constructor(public dto: CreatePostInputDto) {}
}

@CommandHandler(CreatePostByBlogIdCommand)
export class CreatePostByBlogIdUseCase
  implements ICommandHandler<CreatePostByBlogIdCommand, string>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute({ dto }: CreatePostByBlogIdCommand): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Blog not found', field: 'blog' }],
      });
    }

    const post = Post.create(
      {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
      },
      blog.id
    );

    console.log(post);

    await this.postsRepository.savePost(post);

    return post.id
  }
}
