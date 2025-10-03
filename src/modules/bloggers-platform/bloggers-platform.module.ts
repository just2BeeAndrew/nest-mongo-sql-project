import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsController } from './api/blogs.controller';
import { BlogsSuperAdminController } from './api/blogs-super-admin.controller';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { FindBlogByIdQueryHandler } from './application/queries/find-blog-by-id.query-handler';
import { FindAllBlogsQueryHandler } from './application/queries/find-all-blogs.query-handler';
import { UpdateBlogUseCase } from './application/usecases/update-blog.usecase';
import { DeleteBlogUseCase } from './application/usecases/delete-blog.usecase';
import { CreatePostByBlogIdUseCase } from './application/usecases/create-post-by-blog-id.usecase';
import { FindPostByIdQueryHandler } from './application/queries/find-post-by-id.query-handler';
import { FindPostsByBlogIdQueryHandler } from './application/queries/find-post-by-blogId.query-handler';
import { UpdatePostByBlogIdUseCase } from './application/usecases/update-post-by-blog-id.useсase';
import { BlogsQueryRepository } from './infrastructure/query/blogs.query-repository';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/query/posts.query-repository';
import { DeletePostByBlogIdUseCase } from './application/usecases/delete-post-by-blog-id.usecase';
import { FindAllPostsQueryHandler } from './application/queries/find-all-posts.query-handler';
import { CreateCommentUseCase } from './application/usecases/create-coment.usecase';
import { UpdateCommentUseCase } from './application/usecases/update-comment.usecase';
import { DeleteCommentUseCase } from './application/usecases/delete-comment.usecase';
import { CalculateStatusCountUseCase } from './application/usecases/calculate-status-count.usecase';
import { CommentLikeStatusUseCase } from './application/usecases/comment-like-status.usecase';
import { FindCommentByIdQueryHandler } from './application/queries/find-comments-by-id.query-handler';
import { FindCommentsByPostIdQueryHandler } from './application/queries/find-comment-by-post-id.query-handler';
import { PostLikeStatusUseCase } from './application/usecases/post-like-status.usecase';
import { StatusRepository } from './infrastructure/status.repository';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsQueryRepository } from './infrastructure/query/comments.query-repository';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { PostsController } from './api/posts.controller';
import { CommentsController } from './api/comments.controller';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostByBlogIdUseCase,
  UpdatePostByBlogIdUseCase,
  DeletePostByBlogIdUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CalculateStatusCountUseCase,
  PostLikeStatusUseCase,
  CommentLikeStatusUseCase,
];
const queries = [
  FindAllBlogsQueryHandler,
  FindBlogByIdQueryHandler,
  FindAllPostsQueryHandler,
  FindPostByIdQueryHandler,
  FindPostsByBlogIdQueryHandler,
  FindCommentByIdQueryHandler,
  FindCommentsByPostIdQueryHandler,
];

@Module({
  imports: [CqrsModule, UserAccountsModule],
  controllers: [BlogsController, BlogsSuperAdminController, PostsController, CommentsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    StatusRepository,
    ...useCases,
    ...queries,
  ],
})
export class BloggersPlatformModule {}
