import { Module } from '@nestjs/common';
import { UserAccountsController } from './user-accounts.controller';

@Module({
  controllers: [UserAccountsController]
})
export class UserAccountsModule {}
