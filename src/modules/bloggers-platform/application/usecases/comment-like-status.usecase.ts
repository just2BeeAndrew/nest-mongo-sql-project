import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { LikeStatus } from '../../../../core/dto/like-status';
import { StatusRepository } from '../../infrastructure/status.repository';
import { CalculateStatusCountCommand } from './calculate-status-count.usecase';
import { Category } from '../../../../core/dto/category';

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
    private statusRepository: StatusRepository,
  ) {}

  async execute(command: CommentLikeStatusCommand) {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{ message: 'Comment not found', key: 'comment' }],
      });
    }

    const existingStatus = await this.statusRepository.find(
      command.userId,
      command.commentId,
      Category.Comment,
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
        categoryId: command.commentId,
        category: Category.Comment,
        status: command.newStatus,
      });
    }

    const updatedCounts =
      await this.commandBus.execute<CalculateStatusCountCommand>(
        new CalculateStatusCountCommand(
          comment.likesCount,
          comment.dislikesCount,
          currentStatus,
          command.newStatus,
        ),
      );

    await this.commentsRepository.updateCounters(
      updatedCounts.likesCount,
      updatedCounts.dislikesCount,
      comment.id,
    );
  }
}
