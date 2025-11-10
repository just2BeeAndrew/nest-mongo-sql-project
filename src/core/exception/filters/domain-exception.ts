import { DomainExceptionCode } from './domain-exception-codes';

export class Extension {
  constructor(
    public message: string,
    public field?: string,
  ) {}
}

export class DomainException extends Error {
  code: DomainExceptionCode;
  extension: Extension[];

  constructor(errorInfo: {
    code: DomainExceptionCode;
    extension?: Extension[];
  }) {
    super();
    this.code = errorInfo.code;
    this.extension = errorInfo.extension || [];
  }
}
