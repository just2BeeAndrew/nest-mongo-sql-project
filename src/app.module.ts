import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { SecurityDevicesController } from './modules/user-accounts/api/security-devices.controller';
import { AuthController } from './modules/user-accounts/api/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserAccountsModule,
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
  controllers: [AppController, SecurityDevicesController, AuthController],
  providers: [AppService],
})
export class AppModule {}
