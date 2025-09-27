import { FindBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findBlogById(id: string): Promise<BlogsViewDto | null> {
    const blog = await this.dataSource.query(
      `
    SELECT id, name, description, "websiteUrl", "createdAt", "isMembership" FROM "Blogs" WHERE id = $1 and "deletedAt" IS NULL 
    `,
      [id],
    );

    if (blog.length === 0) return null

    return BlogsViewDto.mapToView(blog[0]);
  }

  async findAllBlogs(
    query: FindBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    const nameTerm = query.searchNameTerm ? `%${query.searchNameTerm}%` : `%`;

    const blogs = await this.dataSource.query(
      `
        SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
        FROM "Blogs"
        WHERE name ILIKE $1
          AND "deletedAt" IS NULL
        ORDER BY "${query.sortBy}" ${query.sortDirection}
        LIMIT $2 OFFSET $3
        `,
      [nameTerm, query.pageSize, query.calculateSkip()],
    );

    const totalCountResult = await this.dataSource.query(
      `
        SELECT COUNT(*) as count
        FROM "Blogs"
        WHERE name ILIKE $1
          AND "deletedAt" IS NULL
        `,
      [nameTerm],
    );

    const totalCount = parseInt(totalCountResult[0].count, 10);

    const items = blogs.map(BlogsViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
