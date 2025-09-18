import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TestingModule } from './modules/testing/testing.module';
import { configModule } from './dynamic-config-module';

@Module({
  imports: [
    configModule,
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
      autoLoadEntities: false,
      synchronize: false,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
