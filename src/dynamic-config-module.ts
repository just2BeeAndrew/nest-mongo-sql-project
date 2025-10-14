import { ConfigModule } from '@nestjs/config';
import dbConfig from './core/config/db.config';
import * as dotenv from 'dotenv'
dotenv.config();

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [
    process.env.ENV_FILE_PATH?.trim() || '',
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env.production',
  ],
  load: [dbConfig]
});