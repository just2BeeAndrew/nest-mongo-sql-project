import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { checkExistingUserAndPost } from '../../utils/check-existing-user-and-post';
import { Comment } from '../../domain/entities/comment.entity';

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
  ) {}

  async execute(command: CreateCommentCommand) {
    const { user, post } = await checkExistingUserAndPost(
      command.userId,
      command.postId,
      this.usersRepository,
      this.postsRepository,
    );

    const comment = Comment.create(command.content, post, user);

    return comment.id;
  }
}
