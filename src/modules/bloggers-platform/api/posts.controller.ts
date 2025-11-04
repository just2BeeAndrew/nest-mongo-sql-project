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
import { FindPostsQueryParams } from './input-dto/find-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { FindAllPostsQuery } from '../application/queries/find-all-posts.query-handler';
import { FindPostByIdQuery } from '../application/queries/find-post-by-id.query-handler';
import { JwtAuthGuard } from '../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromAccessToken } from '../../../core/decorators/param/extract-user-from-access-token.decorator';
import { AccessContextDto } from '../../../core/dto/access-context.dto';
import { CreateCommentInputDto } from './input-dto/create-comment.input-dto';
import { CreateCommentCommand } from '../application/usecases/create-coment.usecase';
import { FindCommentByIdQuery } from '../application/queries/find-comments-by-id.query-handler';
import { LikesStatusInputDto } from '../../../core/dto/likes-status.input-dto';
import { PostLikeStatusCommand } from '../application/usecases/post-like-status.usecase';
import { JwtOptionalAuthGuard } from '../../../core/guards/bearer/jwt-optional-auth.guard';
import { ExtractOptionalUserFromRequest } from '../../../core/decorators/param/extract-optional-user-from-request.decorator';
import { FindCommentsByPostIdQueryParams } from './input-dto/find-comments-query-params.input-dto';
import { FindCommentByPostIdQuery } from '../application/queries/find-comment-by-post-id.query-handler';

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
    console.log(likeStatus);

    return this.commandBus.execute<PostLikeStatusCommand>(
      new PostLikeStatusCommand(user.id, postId, likeStatus.likeStatus),
    );
  }

  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async findCommentsByPostId(
    @ExtractOptionalUserFromRequest() user: AccessContextDto | null,
    @Param('postId') postId: string,
    @Query() query: FindCommentsByPostIdQueryParams,
  ) {
    const userId = user ? user.id : null;
    return this.queryBus.execute(
      new FindCommentByPostIdQuery(postId, query, userId),
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
  @UseGuards(JwtOptionalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAllPosts(
    @ExtractOptionalUserFromRequest() user: AccessContextDto | null,
    @Query() query: FindPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const userId = user ? user.id : null;
    return this.queryBus.execute(new FindAllPostsQuery(query, userId));
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findPostById(
    @ExtractOptionalUserFromRequest() user: AccessContextDto | null,
    @Param('id') id: string,
  ): Promise<PostsViewDto> {
    const userId = user ? user.id : null;
    return this.queryBus.execute(new FindPostByIdQuery(id, userId));
  }
}
