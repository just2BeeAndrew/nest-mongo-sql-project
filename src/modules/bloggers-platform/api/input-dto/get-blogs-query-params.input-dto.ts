import { BlogsSortBy } from './blogs-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class GetBlogsQueryParams extends BaseQueryParams {
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;
  searchNameTerm: string | null = null;
}
