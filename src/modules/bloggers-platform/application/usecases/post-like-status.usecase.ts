import { LikeStatus } from '../../../../core/dto/like-status';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostStatusRepository } from '../../infrastructure/post-status.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { CalculateStatusCountCommand } from './calculate-status-count.usecase';
import { checkExistingUserAndPost } from '../../utils/check-existing-user-and-post';
import { PostStatus } from '../../domain/entities/post-status.entity';

export class PostLikeStatusCommand {
  constructor(
    public userId: string,
    public postId: string,
    public newStatus: LikeStatus,
  ) {}
}

@CommandHandler(PostLikeStatusCommand)
export class PostLikeStatusUseCase
  implements ICommandHandler<PostLikeStatusCommand>
{
  constructor(
    private commandBus: CommandBus,
    private postStatusRepository: PostStatusRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: PostLikeStatusCommand) {
    const { user, post } = await checkExistingUserAndPost(
      command.userId,
      command.postId,
      this.usersRepository,
      this.postsRepository,
    );

    const existingStatus = await this.postStatusRepository.find(
      command.userId,
      command.postId,
    );

    const currentStatus = existingStatus
      ? existingStatus.status
      : LikeStatus.None;

    if (existingStatus) {
      if (existingStatus.status === command.newStatus) {
        return;
      } else {
        existingStatus.update(command.newStatus);
      }
    } else if (command.newStatus !== LikeStatus.None) {
      PostStatus.create(
        {
          postId: command.postId,
          status: command.newStatus,
        },
        user,
      );
    }

    const updatedCounts =
      await this.commandBus.execute<CalculateStatusCountCommand>(
        new CalculateStatusCountCommand(
          post.extendedLikesInfo.likesCount,
          post.extendedLikesInfo.dislikesCount,
          currentStatus,
          command.newStatus,
        ),
      );

    post.updateCounters(updatedCounts.likesCount, updatedCounts.dislikesCount);
  }
}
