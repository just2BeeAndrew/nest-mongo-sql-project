import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CoreConfig } from './core.config';

export default registerAs(
  'db',
  () =>
    (coreConfig: CoreConfig): TypeOrmModuleOptions => ({
      type: 'postgres',
      host: coreConfig.DBHost,
      port: coreConfig.DBPort,
      username: coreConfig.DBUsername,
      password: coreConfig.DBPassword,
      database: coreConfig.DBName,
      autoLoadEntities: coreConfig.DBAutoLoadEntities,
      synchronize: coreConfig.DBSynchronize,
      logging: coreConfig.DBLogging,
    }),
);
