import { LikeStatus } from '../../../../core/dto/like-status';
import { LikeDetails } from '../../dto/like-details';

class newestLikesViewDTO {
  addedAt: string;
  userId: string | null;
  login: string | null;
}

class LikesInfoViewDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: newestLikesViewDTO[];
}

export class PostsViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: LikesInfoViewDto;

  static mapToView(post: any, status: LikeStatus, likes: LikeDetails[]): PostsViewDto {
    const dto = new PostsViewDto();

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();
    dto.extendedLikesInfo = {
      likesCount: post.likesCount,//post.extendedLikesInfo.likesCount,
      dislikesCount: post.dislikesCount, //post.extendedLikesInfo.dislikesCount,
      myStatus: status || LikeStatus.None ,
      newestLikes: likes ||[],
    };

    return dto;
  }
}
