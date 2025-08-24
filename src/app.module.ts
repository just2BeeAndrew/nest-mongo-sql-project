import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { SecurityDevicesController } from './modules/user-accounts/api/security-devices.controller';
import { AuthController } from './modules/user-accounts/api/auth.controller';

@Module({
  imports: [UserAccountsModule],
  controllers: [AppController, SecurityDevicesController, AuthController],
  providers: [AppService],
})
export class AppModule {}
