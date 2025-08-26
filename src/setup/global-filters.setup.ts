import {INestApplication} from '@nestjs/common';
import { AllExceptionFilter } from '../core/exception/filters/all-exception.filter';

export function globalFiltersSetup(app: INestApplication) {
  app.useGlobalFilters(new AllExceptionFilter())
}