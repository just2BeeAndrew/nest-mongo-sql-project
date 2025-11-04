import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class UpdateCommentCommand {
  constructor(
    public userId: string,
    public commentId: string,
    public content: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment = await this.commentsRepository.findById(command.commentId);

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Comment not found', field: 'comment' }],
      });
    }

    if (command.userId !== comment.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        extension: [{ message: 'User is not owner', field: 'user' }],
      });
    }

    comment.updateComment(command.content)
    await this.commentsRepository.saveComment(comment);
  }
}
