import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';
import { LikeStatus } from '../../../../core/dto/like-status';
import { Category } from '../../../../core/dto/category';
import { StatusRepository } from '../../infrastructure/status.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

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
    private readonly statusRepository: StatusRepository,
  ) {}

  async execute(query: FindCommentByIdQuery): Promise<CommentsViewDto> {
    let userStatus: LikeStatus = LikeStatus.None;

    if (query.userId) {
      const status = await this.statusRepository.find(
        query.userId,
        query.commentId,
        Category.Comment,
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
