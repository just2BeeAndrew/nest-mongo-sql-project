import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { checkExistingUserAndPost } from '../../utils/check-existing-user-and-post';

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
    const { user, post } = await checkExistingUserAndPost(
      command.userId,
      command.postId,
      this.usersRepository,
      this.postsRepository,
    );
    // const commentId = await this.commentsRepository.create({
    //   postId: command.postId,
    //   content: command.content,
    //   userId: user.id,
    //   userLogin: user.login,
    // });
    //
    // return commentId;
  }
}
