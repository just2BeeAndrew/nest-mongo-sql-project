import {
  Body,
  Controller,
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
import { FindBlogByIdQuery } from '../application/queries/find-blog-by-id-query.handler';
import { FindBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { FindAllBlogsQuery } from '../application/queries/get-all-blogs.query-handler';
import { UpdateBlogsInputDto } from './input-dto/update-blogs.input-dto';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';

@Controller('sa/blogs')
export class BlogsSuperAdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(
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
    return await this.commandBus.execute<UpdateBlogCommand>(new UpdateBlogCommand(id, body));
  }
}
