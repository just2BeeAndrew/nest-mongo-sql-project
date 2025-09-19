import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../core/guards/basic/basic-auth.guard';
import { CreateBlogInputDto } from './input-dto/create-blogs.input-dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { GetBlogByIdQuery } from '../application/queries/get-blog-by-id.query-handler';

@Controller('sa/blogs')
export class BlogsSuperAdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() body: CreateBlogInputDto) {
    const blogId = await this.commandBus.execute<CreateBlogCommand, string>(
      new CreateBlogCommand(body),
    );

    return this.queryBus.execute(new GetBlogByIdQuery(blogId));
  }
}
