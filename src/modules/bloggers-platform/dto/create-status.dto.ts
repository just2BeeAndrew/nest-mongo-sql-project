import { Category } from '../../../core/dto/category';
import { LikeStatus } from '../../../core/dto/like-status';

export class CreateStatusDto {
  userId: string;
  login?: string;
  categoryId: string;
  category: Category;
  status: LikeStatus;
}