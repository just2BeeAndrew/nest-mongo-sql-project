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
      .select('b.id', 'id')
      .addSelect('b.name', 'name')
      .addSelect('b.description', 'description')
      .addSelect('b.websiteUrl', 'websiteUrl')
      .addSelect('b.createdAt', 'createdAt')
      .addSelect('b.isMembership', 'isMembership')
      .where('b.id=:id', { id })
      .andWhere('b.deletedAt IS NULL')
      .getRawOne<BlogRaw>();

    if (!blog) return null;

    return BlogsViewDto.mapToView(blog);
  }

  async findAllBlogs(
    query: FindBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    const nameTerm = query.searchNameTerm ? `%${query.searchNameTerm}%` : null;

    const sortDirection = query.sortDirection.toUpperCase() as 'ASC' | 'DESC';

    let qb = this.blogsRepository
      .createQueryBuilder('b')
      .select([
        'b.id AS id',
        'b.name AS name',
        'b.description AS description',
        'b.websiteUrl AS "websiteUrl"',
        'b.createdAt AS "createdAt"',
        'b.isMembership AS "isMembership"',
      ])
      .where('b.deletedAt IS NULL');

    if (nameTerm) {
      qb = qb.andWhere('b.name ILIKE :nameTerm', { nameTerm });
    }

    qb = qb
      .orderBy(`b.${query.sortBy}`, sortDirection)
      .limit(query.pageSize)
      .offset(query.calculateSkip());

    const blogs = await qb.getRawMany<BlogRaw>();

    let countBlogs = this.blogsRepository
      .createQueryBuilder('b')
      .where('b.deletedAt IS NULL');

    if (nameTerm) {
      countBlogs = countBlogs.andWhere('b.name ILIKE :nameTerm', { nameTerm });
    }

    const totalCount = await countBlogs.getCount();

    const items = blogs.map(BlogsViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
