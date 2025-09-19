import { GetBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findBlogById(id: string): Promise<BlogsViewDto> {
    const blog = await this.dataSource.query(
      `
    SELECT id, name, description, website_url, created_at, is_membership FROM "Blogs" WHERE id = $1
    `,
      [id],
    );

    return BlogsViewDto.mapToView(blog[0]);
  }

  // async getAllBlogs(
  //   query: GetBlogsQueryParams,
  // ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
  //   const filter: FilterQuery<Blog> = {
  //     deletedAt: null,
  //   };
  //
  //   if (query.searchNameTerm) {
  //     filter.$or = filter.$or || [];
  //     filter.$or.push({
  //       name: { $regex: query.searchNameTerm, $options: 'i' },
  //     });
  //   }
  //
  //   const blogs = await this.BlogModel.find(filter)
  //     .sort({ [query.sortBy]: query.sortDirection })
  //     .skip(query.calculateSkip())
  //     .limit(query.pageSize);
  //
  //   const totalCount = await this.BlogModel.countDocuments(filter);
  //
  //   const items = blogs.map(BlogsViewDto.mapToView);
  //
  //   return PaginatedViewDto.mapToView({
  //     items,
  //     totalCount,
  //     page: query.pageNumber,
  //     size: query.pageSize,
  //   });
  //}
}
