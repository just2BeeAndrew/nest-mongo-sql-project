import { Module } from '@nestjs/common';
import { BcryptService } from './application/bcrypt.service';

@Module({
  providers: [BcryptService],
  exports: [BcryptService]
})
export class BcryptModule {}
