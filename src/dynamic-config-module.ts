import { ConfigModule } from '@nestjs/config';
import dbConfig from '../config/db.config';

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