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
    const comment = await this.commentsRepository.findById(
      command.commentId,
    );
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'User not found', field: 'user' }],
      });
    }

    if (comment.userId !== command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        extension: [{ message: 'User is not owner', field: 'user' }],
      });
    }

    await this.commentsRepository.softDelete(comment.id);
  }
}
