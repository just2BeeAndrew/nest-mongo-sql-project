import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('db', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT ?? '5400', 10),
  username: process.env.DB_USERNAME || 'postgres_db',
  password: process.env.DB_PASSWORD || 'postgres_db',
  database: process.env.DB_NAME || 'my_db',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true',
}));
