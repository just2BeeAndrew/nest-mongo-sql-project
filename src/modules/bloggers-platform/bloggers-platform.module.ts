import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsController } from './api/blogs.controller';
import { BlogsSuperAdminController } from './api/blogs-super-admin.controller';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { FindBlogByIdQueryHandler } from './application/queries/find-blog-by-id-query.handler';
import { FindAllBlogsQueryHandler } from './application/queries/get-all-blogs.query-handler';
import { UpdateBlogUseCase } from './application/usecases/update-blog.usecase';
import { DeleteBlogUseCase } from './application/usecases/delete-blog.usecase';
import { CreatePostByBlogIdUseCase } from './application/usecases/create-post-by-blog-id.usecase';

const useCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase, CreatePostByBlogIdUseCase];
const queries = [FindAllBlogsQueryHandler, FindBlogByIdQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [BlogsController, BlogsSuperAdminController],
  providers: [...useCases, ...queries],
})
export class BloggersPlatformModule {}
