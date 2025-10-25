import { FindBlogsQueryParams } from '../../api/input-dto/find-blogs-query-params.input-dto';
import { BlogRaw, BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../../domain/entities/blog.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findBlogById(id: string): Promise<BlogsViewDto | null> {
    const blog = await this.blogsRepository
      .createQueryBuilder('b')
      .select('b.id','id')
      .addSelect('b.name','name')
      .addSelect('b.description','description')
      .addSelect('b.websiteUrl','websiteUrl')
      .addSelect('b.createdAt','createdAt')
      .addSelect('b.isMembership','isMembership')
      .where('b.id=:id', { id })
      .andWhere('b.deletedAt IS NULL')
      .getRawOne<BlogRaw>();

    if (!blog) return null;

    return BlogsViewDto.mapToView(blog);
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
