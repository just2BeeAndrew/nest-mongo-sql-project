import { DomainExceptionCode } from './domain-exception-codes';

export class DomainException extends Error {
  code: DomainExceptionCode;
  message: string;
  field: string

  constructor(errorInfo: {
    code: DomainExceptionCode;
    message?: string;
    field?: string;
  }) {
    super(errorInfo.message);
    this.code = errorInfo.code;
    this.message = errorInfo.message ?? 'error';
    this.field = errorInfo.field ?? 'unknown';

  }
}
