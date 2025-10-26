import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainExceptionCode } from './domain-exception-codes';
import { DomainException } from './domain-exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error(exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody: { errorsMessages: { message: string; field?: string }[] } =
      {
        errorsMessages: [],
      };

    if (this.isDomainException(exception)) {
      status = this.getStatusFromCode(exception.code);

      responseBody.errorsMessages = exception.extension.map((ext) => ({
        message: ext.message,
        field: ext.field,
      }));
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && responseBody.errorsMessages.length === 0) {
      responseBody.errorsMessages.push({ message: 'Internal Server Error', field: 'server' });
    }


    response.status(status).json(responseBody);
  }

  private isDomainException(exception: any): exception is DomainException {
    return exception instanceof DomainException;
  }

  private getStatusFromCode(code: DomainExceptionCode): HttpStatus {
    switch (code) {
      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCode.BadRequest:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCode.ValidationError:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      case DomainExceptionCode.EmailNotConfirmed:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.ConfirmationCodeExpired:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.TooManyRequests:
        return HttpStatus.TOO_MANY_REQUESTS;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
