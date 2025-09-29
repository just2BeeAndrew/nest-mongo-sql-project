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
    const comment = await this.commentsRepository.update({
      userId: command.userId,
      commentId: command.commentId,
      content: command.content,
    });

    if (comment[0].length === 0) {
      const commentIsExist = await this.commentsRepository.isExist(
        command.commentId,
      );
      if (commentIsExist[0] === 0) {
        throw new DomainException({
          code: DomainExceptionCode.NotFound,
          message: 'Not Found',
          extensions: [{ message: 'Comment not found', key: 'comment' }],
        });
      } else {
        throw new DomainException({
          code: DomainExceptionCode.Forbidden,
          message: 'Forbidden',
          extensions: [{ message: 'User is not owner', key: 'user' }],
        });
      }
    }
  }
}
