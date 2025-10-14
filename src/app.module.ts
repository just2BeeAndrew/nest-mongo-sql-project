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
import { ConfigModule } from '@nestjs/config';
import { DbConfigService } from './core/config/db.config.service';

//TODO: сделать ревью подключения бд
@Module({
  imports: [
    configModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbConfigService,
    }),
    BloggersPlatformModule,
    UserAccountsModule,
    NotificationsModule,
    TestingModule,
    CqrsModule.forRoot({}),
  ],
  controllers: [
    AppController,
    BlogsController,
    BlogsSuperAdminController,
    PostsController,
    CommentsController,
  ],
  providers: [AppService],
})
export class AppModule {}
