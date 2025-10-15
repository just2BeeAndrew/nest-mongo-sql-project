import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreConfig } from './config/core.config';

@Global()
@Module({
  imports: [CqrsModule],
  exports: [CoreConfig, CqrsModule],
  providers: [CoreConfig],
})
export class CoreModule {}