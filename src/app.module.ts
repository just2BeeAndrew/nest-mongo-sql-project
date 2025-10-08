import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TestingModule } from './modules/testing/testing.module';
import { configModule } from './dynamic-config-module';
import { BlogsController } from './modules/bloggers-platform/api/blogs.controller';
import { BlogsSuperAdminController } from './modules/bloggers-platform/api/blogs-super-admin.controller';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { PostsController } from './modules/bloggers-platform/api/posts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsController } from './modules/bloggers-platform/api/comments.controller';

@Module({
  imports: [
    configModule,
    BloggersPlatformModule,
    UserAccountsModule,
    NotificationsModule,
    TestingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5400,
      username: 'postgres_db',
      password: 'postgres_db',
      database: 'my_db',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    CqrsModule.forRoot({})
  ],
  controllers: [AppController, BlogsController, BlogsSuperAdminController, PostsController, CommentsController],
  providers: [AppService],
})
export class AppModule {}
