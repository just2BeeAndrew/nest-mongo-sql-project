import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { DeleteAllUseCase } from './application/usecases/delete-all.usecase';
import { TestingRepository } from './infrastructure/testing.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule
    ],
  controllers: [TestingController],
  providers: [TestingRepository,DeleteAllUseCase],
  exports: []
})
export class TestingModule {}
