import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsController } from './api/blogs.controller';
import { BlogsSuperAdminController } from './api/blogs-super-admin.controller';

@Module({
  imports: [CqrsModule],
  controllers: [BlogsController, BlogsSuperAdminController]
})
export class BloggersPlatformModule {}
