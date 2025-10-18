import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class DeleteCommentCommand {
  constructor(
    public userId: string,
    public commentId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand) {
    const comment = await this.commentsRepository.softDelete({
      commentId: command.commentId,
      userId: command.userId,
    });
    if (comment[0].length === 0) {
      const commentIsExist = await this.commentsRepository.isExist(
        command.commentId,
      );
      if (commentIsExist.length === 0) {
        throw new DomainException({
          code: DomainExceptionCode.NotFound,
          message: 'Comment not found',
          field: 'comment',
        });
      } else {
        throw new DomainException({
          code: DomainExceptionCode.Forbidden,
          message: 'User is not owner',
          field: 'user',
        });
      }
    }
  }
}
