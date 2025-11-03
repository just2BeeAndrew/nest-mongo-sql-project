import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { LikeStatus } from '../../../../core/dto/like-status';
import { CalculateStatusCountCommand } from './calculate-status-count.usecase';
import { CommentStatusRepository } from '../../infrastructure/comment-status.repository';
import { CommentStatus } from '../../domain/entities/comment-status.entity';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';

export class CommentLikeStatusCommand {
  constructor(
    public userId: string,
    public commentId: string,
    public newStatus: LikeStatus,
  ) {}
}

@CommandHandler(CommentLikeStatusCommand)
export class CommentLikeStatusUseCase
  implements ICommandHandler<CommentLikeStatusCommand>
{
  constructor(
    private commandBus: CommandBus,
    private commentsRepository: CommentsRepository,
    private commentStatusRepository: CommentStatusRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: CommentLikeStatusCommand) {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Comment not found', field: 'comment' }],
      });
    }

    const user = await this.usersRepository.findById(command.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'User not found', field: 'user' }],
      });
    }

    const existingStatus = await this.commentStatusRepository.find(
      command.userId,
      command.commentId,
    );

    const currentStatus = existingStatus
      ? existingStatus.status
      : LikeStatus.None;

    if (existingStatus) {
      if (existingStatus.status === command.newStatus) {
        return;
      } else {
        existingStatus.update(command.newStatus);
        await this.commentStatusRepository.saveStatus(existingStatus);
      }
    } else if (command.newStatus !== LikeStatus.None) {
      const status = CommentStatus.create(command.newStatus, comment, user);

      await this.commentStatusRepository.saveStatus(status);
    }

    const updatedCounts =
      await this.commandBus.execute<CalculateStatusCountCommand>(
        new CalculateStatusCountCommand(
          comment.likesInfo.likesCount,
          comment.likesInfo.dislikesCount,
          currentStatus,
          command.newStatus,
        ),
      );
    comment.updateCounters(
      updatedCounts.likesCount,
      updatedCounts.dislikesCount,
    );

    await this.commentsRepository.saveComment(comment);
  }
}
