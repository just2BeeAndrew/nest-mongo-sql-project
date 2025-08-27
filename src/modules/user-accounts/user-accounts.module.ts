import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UsersRepository],
})
export class UserAccountsModule {}
