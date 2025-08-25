import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users-repository.service';

@Module({
  controllers: [UsersController],
  providers: [UsersRepository],
})
export class UserAccountsModule {}
