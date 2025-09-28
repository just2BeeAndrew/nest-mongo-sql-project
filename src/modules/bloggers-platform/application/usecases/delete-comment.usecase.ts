import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';

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
  constructor(private commentRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand) {
    const comment = await this.commentRepository.findCommentById(
      command.commentId,
    );
    console.log(comment);
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'User not found', key: 'user' }],
      });
    }

    if (comment.commentatorInfo.userId !== command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'Forbidden',
        extensions: [{ message: 'User is not owner', key: 'user' }],
      });
    }

    comment.softDelete();
    await this.commentRepository.save(comment);
  }
}
