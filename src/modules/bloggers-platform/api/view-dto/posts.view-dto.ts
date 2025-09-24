import { LikeStatus } from '../../../../core/dto/like-status';

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

  static mapToView(post: any, status: LikeStatus): PostsViewDto {
    const dto = new PostsViewDto();

    dto.id = post.id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();
    dto.extendedLikesInfo = {
      likesCount: 0,//post.extendedLikesInfo.likesCount,
      dislikesCount: 0, //post.extendedLikesInfo.dislikesCount,
      myStatus: status || LikeStatus.None ,
      newestLikes: [],
      // newestLikes: post.extendedLikesInfo.newestLikes.map((like) => ({
      //   addedAt: like.addedAt,
      //   userId: like.userId,
      //   login: like.login,
      // })),
    };

    return dto;
  }
}
