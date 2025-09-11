import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { DeleteAllUseCase } from './application/usecases/delete-all.usecase';

@Module({
  imports: [
    ],
  controllers: [TestingController],
  providers: [DeleteAllUseCase],
  exports: []
})
export class TestingModule {}
