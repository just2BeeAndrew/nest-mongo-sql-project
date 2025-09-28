import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class CreateCommentCommand {
  constructor(
    public userId: string,
    public postId: string,
    public content: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    const user = await this.usersRepository.findById(command.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'User not found', key: 'user' }],
      });
    }

    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'Post not found', key: 'post' }],
      });
    }
    const comment = await this.commentsRepository.create({
      postId: post.id,
      content: command.content,
      userId: user.id,
      userLogin: user.login,
    });

    return comment[0].id;
  }
}
