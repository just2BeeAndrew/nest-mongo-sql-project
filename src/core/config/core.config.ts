import { Injectable } from '@nestjs/common';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../setup/config-validation.utility';

//TODO:Показать конфиг
export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
  MIGRATION = 'migration',
}

@Injectable()
export class CoreConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable PORT',
    },
  )
  port: number;

  @IsNotEmpty({
    message: 'Set Env variable DB_HOST',
  })
  DBHost: string;

  @IsNumber(
    {},
    {
      message: 'Set Env variable DB_PORT',
    },
  )
  DBPort: number;

  @IsNotEmpty({
    message: 'Set Env variable DB_USERNAME',
  })
  @IsString()
  DBUsername: string;

  @IsNotEmpty({
    message: 'Set Env variable DB_PASSWORD',
  })
  @IsString()
  DBPassword: string;

  @IsNotEmpty({
    message: 'Set Env variable DB_NAME',
  })
  @IsString()
  DBName: string;

  @IsBoolean(
    {
      message: 'Set Env variable DB_AUTO_LOAD_ENTITY (true or false)',
    }
  )
  DBAutoLoadEntities: boolean;

  @IsBoolean({
    message: 'Set Env variable DB_SYNCHRONIZE (true or false)',
  })
  DBSynchronize: boolean;

  @IsBoolean({
    message: 'Set Env variable DB_LOGGING (true or false)',
  })
  DBLogging: boolean;

  @IsBoolean({
    message: 'Set Env variable IS_SWAGGER_ENABLE (true or false)',
  })
  isSwaggerEnabled: boolean;

  @IsBoolean({
    message: 'Set Env variable INCLUDE_TESTING_MODULE (true or false)',
  })
  includeTestingModule: boolean;

  @IsEnum(Environments, {
    message:
      'Ser correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: string

  constructor(private configService: ConfigService<any, true>) {
    this.port = Number(this.configService.get('PORT'));
    this.DBHost = this.configService.get('DB_HOST');
    this.DBPort = Number(this.configService.get('DB_PORT'));
    this.DBUsername = this.configService.get('DB_USERNAME');
    this.DBPassword = this.configService.get('DB_PASSWORD');
    this.DBName = this.configService.get('DB_NAME');
    this.DBAutoLoadEntities = configValidationUtility.convertToBoolean(this.configService.get('DB_AUTO_LOAD_ENTITY')) as boolean
    this.DBSynchronize = configValidationUtility.convertToBoolean(this.configService.get('DB_SYNCHRONIZE')) as boolean
    this.DBLogging = configValidationUtility.convertToBoolean(this.configService.get('DB_LOGGING')) as boolean
    this.isSwaggerEnabled = configValidationUtility.convertToBoolean(this.configService.get('IS_SWAGGER_ENABLE')) as boolean
    this.includeTestingModule = configValidationUtility.convertToBoolean(this.configService.get('INCLUDE_TESTING_MODULE')) as boolean

    this.env = this.configService.get('NODE_ENV');

    configValidationUtility.validateConfig(this);
  }
}
