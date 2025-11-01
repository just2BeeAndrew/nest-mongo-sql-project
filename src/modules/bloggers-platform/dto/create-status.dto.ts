import { LikeStatus } from '../../../core/dto/like-status';

export class CreateStatusDto {
  postId: string;
  status: LikeStatus;
}