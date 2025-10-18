import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { DomainException } from '../core/exception/filters/domain-exception';

import { DomainExceptionCode } from '../core/exception/filters/domain-exception-codes';

export const errorFormatter = (
  errors: ValidationError[],
  errorMessage: Array<{ message: string; field: string }> = [],
): Array<{ message: string; field: string }> => {
  for (const error of errors) {
    if (!error.constraints && error.children?.length) {
      errorFormatter(error.children, errorMessage);
    } else if (error.constraints) {
      const constrainKeys = Object.keys(error.constraints);

      for (const key of constrainKeys) {
        errorMessage.push({
          message: error.constraints[key]
            ? `${error.constraints[key]}; Received value: ${error?.value}`
            : '',
          field: error.property,
        });
      }
    }
  }
  return errorMessage;
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,

      exceptionFactory: (errors) => {
        const formattedErrors = errorFormatter(errors);
        const firstError = formattedErrors[0];

        throw new DomainException({
          code: DomainExceptionCode.ValidationError,
          message: firstError?.message || 'Validation error',
          field: firstError?.field || 'unknown',
        });
      },
    }),
  );
}
