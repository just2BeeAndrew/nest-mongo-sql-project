import { LikeStatus } from '../../../../core/dto/like-status';

class CommentatorInfoTypeViewDto {
  userId: string;
  userLogin: string;
}

class LikesInfoTypeViewDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus
}

export class CommentsViewDto {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoTypeViewDto;
  createdAt: string;
  likesInfo: LikesInfoTypeViewDto;

  static mapToView(comment: any, status: LikeStatus): CommentsViewDto {
    const dto = new CommentsViewDto();

    dto.id = comment.id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    }
    dto.createdAt = comment.createdAt.toISOString();
    dto.likesInfo = {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: status
    }

    return dto;
  }
}
