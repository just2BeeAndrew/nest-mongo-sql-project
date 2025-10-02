import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindBlogsQueryParams } from './input-dto/find-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { FindAllBlogsQuery } from '../application/queries/find-all-blogs.query-handler';
import { FindPostsQueryParams } from './input-dto/find-posts-query-params.input-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { FindPostsByBlogIdQuery } from '../application/queries/find-post-by-blogId.query-handler';
import { FindBlogByIdQuery } from '../application/queries/find-blog-by-id.query-handler';
import { JwtOptionalAuthGuard } from '../../../core/guards/bearer/jwt-optional-auth.guard';
import {
  ExtractOptionalUserFromRequest
} from '../../../core/decorators/param/extract-optional-user-from-request.decorator';
import { AccessContextDto } from '../../../core/dto/access-context.dto';

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
  @UseGuards(JwtOptionalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAllPostsByBlogId(
    @ExtractOptionalUserFromRequest() user: AccessContextDto,
    @Param('blogId') blogId: string,
    @Query() query: FindPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const userId = user ? user.id : null;
    return this.queryBus.execute(new FindPostsByBlogIdQuery(blogId, query, userId));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findBlogById(@Param('id') id: string): Promise<BlogsViewDto> {
    return this.queryBus.execute(new FindBlogByIdQuery(id));
  }
}
