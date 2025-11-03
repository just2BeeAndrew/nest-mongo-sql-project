import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { checkExistingUserAndPost } from '../../utils/check-existing-user-and-post';
import { Comment } from '../../domain/entities/comment.entity';
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
    private commentRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    const { user, post } = await checkExistingUserAndPost(
      command.userId,
      command.postId,
      this.usersRepository,
      this.postsRepository,
    );

    const comment = Comment.create(command.content, post, user);

    await this.commentRepository.saveComment(comment);

    return comment.id;
  }
}
