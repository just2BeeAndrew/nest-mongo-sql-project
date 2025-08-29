import { IsEnum } from 'class-validator';
import {LikeStatus} from './like-status';

export class LikesStatusInputDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
