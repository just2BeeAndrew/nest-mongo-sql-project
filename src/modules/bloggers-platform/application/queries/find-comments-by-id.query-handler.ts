import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';
import { LikeStatus } from '../../../../core/dto/like-status';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { CommentStatusRepository } from '../../infrastructure/comment-status.repository';

export class FindCommentByIdQuery {
  constructor(
    public commentId: string,
    public userId?: string | null,
  ) {}
}

@QueryHandler(FindCommentByIdQuery)
export class FindCommentByIdQueryHandler
  implements IQueryHandler<FindCommentByIdQuery, CommentsViewDto>
{
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentStatusRepository: CommentStatusRepository,
  ) {}

  async execute(query: FindCommentByIdQuery): Promise<CommentsViewDto> {
    let userStatus: LikeStatus = LikeStatus.None;

    if (query.userId) {
      const status = await this.commentStatusRepository.find(
        query.userId,
        query.commentId,
      );
      userStatus = status ? status.status : LikeStatus.None;
    }

    const comment = await this.commentsQueryRepository.findById(
      query.commentId,
      userStatus,
    );
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Comment not found', field: 'comment' }],
      });
    }

    return comment;
  }
}
