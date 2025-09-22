import { CreatePostInputDto } from '../../api/input-dto/create-post.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostByBlogIdCommand {
  constructor(public dto: CreatePostInputDto) {
  }
}

@CommandHandler(CreatePostByBlogIdCommand)
export class CreatePostByBlogIdUseCase implements ICommandHandler<CreatePostByBlogIdCommand,string> {
  constructor(private readonly blogsRepository: BlogsRepository,
              private readonly postsRepository: PostsRepository,) {}

  async execute({dto}: CreatePostByBlogIdCommand): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId);

    const post = await this.postsRepository.create({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    })
  }
}