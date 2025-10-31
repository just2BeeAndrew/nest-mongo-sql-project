import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

const envFilePaths = [
  process.env.ENV_FILE_PATH?.trim() || '',
  join(__dirname, `src`, `env`, `.env.${process.env.NODE_ENV}.local`),
  join(__dirname, `src`, `env`, `.env.${process.env.NODE_ENV}`),
  join(__dirname, `src`, `env`, `.env.production`),
];

config({ path: envFilePaths });

console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5400,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [__dirname + '/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});
