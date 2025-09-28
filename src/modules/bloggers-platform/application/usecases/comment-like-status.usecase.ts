import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { LikeStatus } from '../../../../../core/dto/like-status';
import { StatusRepository } from '../../infrastructure/status.repository';
import { Status, StatusModelType } from '../../domain/status.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CalculateStatusCountCommand } from './calculate-status-count.usecase';
import { Category } from '../../../../../core/dto/category';

export class CommentLikeStatusCommand {
  constructor(
    public userId: string,
    public commentId: string,
    public newStatus: LikeStatus,
  ) {}
}

@CommandHandler(CommentLikeStatusCommand)
export class CommentLikeStatusUseCase implements ICommandHandler<CommentLikeStatusCommand> {
  constructor(
    @InjectModel(Status.name) private StatusModel: StatusModelType,
    private commandBus: CommandBus,
    private commentsRepository: CommentsRepository,
    private statusRepository: StatusRepository,
  ) {}

  async execute(command: CommentLikeStatusCommand) {
    const comment = await this.commentsRepository.findCommentById(
      command.commentId,
    );
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{ message: 'Comment not found', key: 'comment' }],
      });
    }

    const existingStatus = await this.statusRepository.findStatus(
      command.userId,
      command.commentId,
      Category.Comment
    );

    const currentStatus = existingStatus
      ? existingStatus.status
      : LikeStatus.None;

    if (existingStatus) {
      if (existingStatus.status === command.newStatus) {
        return;
      } else {
        existingStatus.setStatus(command.newStatus);
        await this.statusRepository.save(existingStatus);
      }
    } else if (command.newStatus !== LikeStatus.None) {
      const status = this.StatusModel.createInstance({
        userId: command.userId,
        categoryId: command.commentId,
        category: Category.Comment,
        status: command.newStatus,
      });
      await this.statusRepository.save(status);
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

    comment.setStatusCounters(
      updatedCounts.likesCount,
      updatedCounts.dislikesCount,
    );
    await this.commentsRepository.save(comment);
  }
}
