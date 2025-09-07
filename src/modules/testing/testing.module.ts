import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';

@Module({
  imports: [
    ],
  controllers: [TestingController],
  providers: [],
  exports: []
})
export class TestingModule {}
