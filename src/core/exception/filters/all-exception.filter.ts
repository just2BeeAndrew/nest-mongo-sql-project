import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainExceptionCode } from './domain-exception-codes';
import { Extension } from './domain-exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error(exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = exception.code;

    const responseBody = this.buildResponseBody(exception.extensions);

    switch (code) {
      case DomainExceptionCode.NotFound:
        status = HttpStatus.NOT_FOUND;
        break;
      case DomainExceptionCode.BadRequest:
        status = HttpStatus.BAD_REQUEST;
        break;
      case DomainExceptionCode.Forbidden:
        status = HttpStatus.FORBIDDEN;
        break;
      case DomainExceptionCode.ValidationError:
        status = HttpStatus.BAD_REQUEST;
        break;
      case DomainExceptionCode.Unauthorized:
        status = HttpStatus.UNAUTHORIZED;
        break;
      case DomainExceptionCode.EmailNotConfirmed:
        status = HttpStatus.BAD_REQUEST;
        break;
      case DomainExceptionCode.ConfirmationCodeExpired:
        status = HttpStatus.BAD_REQUEST;
        break;
      case DomainExceptionCode.PasswordRecoveryCodeExpired:
        status = HttpStatus.BAD_REQUEST;
        break;
      case DomainExceptionCode.TooManyRequests:
        status = HttpStatus.TOO_MANY_REQUESTS;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json(responseBody);
  }

  private buildResponseBody(extensions?: Extension[]): {
    errorsMessages: { message: string; field: string }[];
  } {
    const safeExtensions = Array.isArray(extensions) ? extensions : [];

    const errorsMessages = safeExtensions.map((ext) => ({
      message: ext.message,
      field: ext.key,
    }));

    return { errorsMessages };
  }
}
