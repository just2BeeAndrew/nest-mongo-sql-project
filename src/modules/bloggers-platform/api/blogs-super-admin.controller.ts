import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../core/guards/basic/basic-auth.guard';
import { CreateBlogInputDto } from './input-dto/create-blogs.input-dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { FindBlogByIdQuery } from '../application/queries/find-blog-by-id.query-handler';
import { FindBlogsQueryParams } from './input-dto/find-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { FindAllBlogsQuery } from '../application/queries/find-all-blogs.query-handler';
import { UpdateBlogsInputDto } from './input-dto/update-blogs.input-dto';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { CreatePostByBlogIdInputDto } from './input-dto/create-post-by-blog-id-input.dto';
import { LikeStatus } from '../../../core/dto/like-status';
import { CreatePostByBlogIdCommand } from '../application/usecases/create-post-by-blog-id.usecase';
import { FindPostByIdQuery } from '../application/queries/find-post-by-id.query-handler';
import { FindPostsQueryParams } from './input-dto/find-posts-query-params.input-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { FindPostsByBlogIdQuery } from '../application/queries/find-post-by-blogId.query-handler';
import { UpdatePostCommand } from '../application/usecases/update-post-by-blog-id.useсase';
import { UpdatePostInputDto } from './input-dto/update-post-input.dto';
import { DeletePostCommand } from '../application/usecases/delete-post-by-blog-id.usecase';

@Controller('sa/blogs')
export class BlogsSuperAdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAllBlogs(
    @Query() query: FindBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    return this.queryBus.execute(new FindAllBlogsQuery(query));
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() body: CreateBlogInputDto) {
    const blogId = await this.commandBus.execute<CreateBlogCommand, string>(
      new CreateBlogCommand(body),
    );

    return this.queryBus.execute(new FindBlogByIdQuery(blogId));
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogsInputDto) {
    return await this.commandBus.execute<UpdateBlogCommand>(
      new UpdateBlogCommand(id, body),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard)
  async deleteBlog(@Param('id') id: string) {
    return await this.commandBus.execute<DeleteBlogCommand>(
      new DeleteBlogCommand(id),
    );
  }

  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BasicAuthGuard)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() body: CreatePostByBlogIdInputDto,
  ) {
    const postId = await this.commandBus.execute<CreatePostByBlogIdCommand>(
      new CreatePostByBlogIdCommand({ ...body, blogId }),
    );

    return this.queryBus.execute(
      new FindPostByIdQuery(postId, LikeStatus.None),
    );
  }

  @Get(':blogId/posts')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: FindPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.queryBus.execute(new FindPostsByBlogIdQuery(blogId, query));
  }

  @Put(':blogId/posts/:postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() body: UpdatePostInputDto,
  ) {
    await this.commandBus.execute<UpdatePostCommand>(
      new UpdatePostCommand(blogId, postId, body),
    );
  }

  @Delete(':blogId/posts/:postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ){
    await this.commandBus.execute<DeletePostCommand>(
      new DeletePostCommand(blogId,postId)
    )
  }
}
