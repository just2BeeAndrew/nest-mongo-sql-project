import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';
import { LikeStatus } from '../../../../../core/dto/like-status';
import { StatusRepository } from '../../infrastructure/status.repository';
import { Category } from '../../../../../core/dto/category';

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
      const status = await this.statusRepository.findStatus(
        query.userId,
        query.commentId,
        Category.Comment,
      );
      userStatus = status ? status.status : LikeStatus.None;
    }

    return this.commentsQueryRepository.getCommentByIdOrNotFoundFail(query.commentId, userStatus)
  }
}
