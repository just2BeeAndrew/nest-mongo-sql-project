import { LikeStatus } from '../../../../core/dto/like-status';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsRepository } from '../../infrastructure/posts.repository';
import { StatusRepository } from '../../infrastructure/status.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { Category } from '../../../../core/dto/category';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { CalculateStatusCountCommand } from './calculate-status-count.usecase';

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
    private statusRepository: StatusRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: PostLikeStatusCommand) {
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
        message: 'Not found',
        extensions: [{ message: 'Post not found', key: 'post' }],
      });
    }

    const existingStatus = await this.statusRepository.find(
      command.userId,
      command.postId,
      Category.Post,
    );

    const currentStatus = existingStatus
      ? existingStatus.status
      : LikeStatus.None;

    if (existingStatus) {
      if (existingStatus.status === command.newStatus) {
        return;
      } else {
        await this.statusRepository.updateStatus(
          existingStatus.id,
          command.newStatus,
        );
      }
    } else if (command.newStatus !== LikeStatus.None) {
      await this.statusRepository.create({
        userId: command.userId,
        login: user.login,
        categoryId: command.postId,
        category: Category.Post,
        status: command.newStatus,
      });
    }

    const updatedCounts =
      await this.commandBus.execute<CalculateStatusCountCommand>(
        new CalculateStatusCountCommand(
          post.likesCount,
          post.dislikesCount,
          currentStatus,
          command.newStatus,
        ),
      );

    await this.postsRepository.updateCounters(
      updatedCounts.likesCount,
      updatedCounts.dislikesCount,
      post.id,
    );
  }
}
