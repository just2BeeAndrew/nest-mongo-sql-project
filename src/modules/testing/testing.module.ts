import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { DeleteAllUseCase } from './application/usecases/delete-all.usecase';
import { TestingRepository } from './infrastructure/testing.repository';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BloggersPlatformModule } from '../bloggers-platform/bloggers-platform.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user-accounts/domain/entities/user.entity';

@Module({
  imports: [BloggersPlatformModule, UserAccountsModule,
  TypeOrmModule.forFeature([User])],
  controllers: [TestingController],
  providers: [TestingRepository, DeleteAllUseCase],
  exports: [],
})
export class TestingModule {}
