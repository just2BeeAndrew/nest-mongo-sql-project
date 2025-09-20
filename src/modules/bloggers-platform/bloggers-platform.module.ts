import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsController } from './api/blogs.controller';
import { BlogsSuperAdminController } from './api/blogs-super-admin.controller';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { FindBlogByIdQueryHandler } from './application/queries/find-blog-by-id-query.handler';
import { FindAllBlogsQueryHandler } from './application/queries/get-all-blogs.query-handler';

const useCases = [CreateBlogUseCase];
const queries = [FindAllBlogsQueryHandler, FindBlogByIdQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [BlogsController, BlogsSuperAdminController],
  providers: [...useCases, ...queries],
})
export class BloggersPlatformModule {}
