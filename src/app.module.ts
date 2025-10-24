import { DynamicModule, Module } from '@nestjs/common';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/config/core.config';

const testingModule:any = [];
if(process.env.NODE_ENV === 'testing'){
  testingModule.push(TestingModule);
}
//TODO: сделать ревью подключения бд
@Module({
  imports: [
    configModule,
    CoreModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService, CoreConfig],
      useFactory: (configService: ConfigService, coreConfig:CoreConfig) => {
        const DBConfigFactory = configService.get('db');
        return DBConfigFactory(coreConfig)
      }
    }),
    BloggersPlatformModule,
    UserAccountsModule,
    TestingModule,
    NotificationsModule,
    ...testingModule,
    CqrsModule.forRoot({}),
  ],
  controllers: [
    AppController,
    BlogsController,
    BlogsSuperAdminController,
    PostsController,
    CommentsController,
  ],
  providers: [AppService, CoreConfig],
  exports: [CoreConfig]
})
export class AppModule {
  static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {

    return {
      module: AppModule,
      imports: [...(coreConfig.includeTestingModule ? [TestingModule] : [])], // Add dynamic modules here
    };
  }
}
