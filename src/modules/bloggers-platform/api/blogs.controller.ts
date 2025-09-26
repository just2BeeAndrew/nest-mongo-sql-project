import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { FindAllBlogsQuery } from '../application/queries/find-all-blogs.query-handler';
import { FindPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { FindPostsByBlogIdQuery } from '../application/queries/find-post-by-blogId.query-handler';
import { FindBlogByIdQuery } from '../application/queries/find-blog-by-id.query-handler';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllBlogs(
    @Query() query: FindBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    return this.queryBus.execute(new FindAllBlogsQuery(query));
  }

  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  async findAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: FindPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.queryBus.execute(new FindPostsByBlogIdQuery(blogId, query));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findBlogById(@Param('id') id: string): Promise<BlogsViewDto> {
    return this.queryBus.execute(new FindBlogByIdQuery(id));
  }
}
