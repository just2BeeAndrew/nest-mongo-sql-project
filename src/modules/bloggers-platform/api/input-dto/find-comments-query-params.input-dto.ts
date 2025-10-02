import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';

enum CommentSortBy{
  CreatedAt = 'createdAt',
}

export class FindCommentsByPostIdQueryParams extends BaseQueryParams{
  @IsEnum(CommentSortBy)
  sortBy: CommentSortBy = CommentSortBy.CreatedAt
}