import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { FindAllPostsQuery } from '../application/queries/find-all-posts.query-handler';
import { FindPostByIdQuery } from '../application/queries/find-post-by-id.query-handler';
import { LikeStatus } from '../../../core/dto/like-status';

@Controller('posts')
export class PostsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllPosts(
    @Query() query: FindPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.queryBus.execute(new FindAllPostsQuery(query));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findPostById(@Param('id') id: string): Promise<PostsViewDto> {
    return this.queryBus.execute(new FindPostByIdQuery(id, LikeStatus.None));
  }
}
