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
import { UpdatePostByBlogIdUsecase } from './application/usecases/update-post-by-blog-id.usecase';
import { BlogsQueryRepository } from './infrastructure/query/blogs.query-repository';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/query/posts.query-repository';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostByBlogIdUseCase,
  UpdatePostByBlogIdUsecase,
];
const queries = [
  FindAllBlogsQueryHandler,
  FindBlogByIdQueryHandler,
  FindPostByIdQueryHandler,
  FindPostsByBlogIdQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [BlogsController, BlogsSuperAdminController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    ...useCases,
    ...queries,
  ],
})
export class BloggersPlatformModule {}
