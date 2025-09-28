import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';

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
    const comment = await this.commentsRepository.findCommentById(
      command.commentId,
    );
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'Comment not found', key: 'comment' }],
      });
    }

    if (comment.commentatorInfo.userId !== command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'Forbidden',
        extensions: [{ message: 'User is not owner', key: 'user' }],
      });
    }

    comment.setComment(command.content);
    await this.commentsRepository.save(comment);
  }
}
