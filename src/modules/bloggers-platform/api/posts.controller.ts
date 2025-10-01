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
import { FindPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { FindAllPostsQuery } from '../application/queries/find-all-posts.query-handler';
import { FindPostByIdQuery } from '../application/queries/find-post-by-id.query-handler';
import { LikeStatus } from '../../../core/dto/like-status';
import { JwtAuthGuard } from '../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromAccessToken } from '../../../core/decorators/param/extract-user-from-access-token.decorator';
import { AccessContextDto } from '../../../core/dto/access-context.dto';
import { CreateCommentInputDto } from './input-dto/create-comment.input-dto';
import { CreateCommentCommand } from '../application/usecases/create-coment.usecase';
import { FindCommentByIdQuery } from '../application/queries/find-comments-by-id.query-handler';
import { LikesStatusInputDto } from '../../../core/dto/likes-status.input-dto';
import { PostLikeStatusCommand } from '../application/usecases/post-like-status.usecase';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async postLikeStatus(
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Param('postId') postId: string,
    @Body() likeStatus: LikesStatusInputDto,
  ) {
    return this.commandBus.execute<PostLikeStatusCommand>(
      new PostLikeStatusCommand(user.id, postId, likeStatus.likeStatus),
    );
  }

  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Param('postId') postId: string,
    @Body() body: CreateCommentInputDto,
  ) {
    const commentId = await this.commandBus.execute<CreateCommentCommand>(
      new CreateCommentCommand(user.id, postId, body.content),
    );
    return this.queryBus.execute(new FindCommentByIdQuery(commentId, user.id));
  }

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
