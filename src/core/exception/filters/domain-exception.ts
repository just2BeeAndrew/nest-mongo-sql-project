import { DomainExceptionCode } from './domain-exception-codes';

export class Extension {
  constructor(
    public message: string,
    public field: string,
  ) {}
}

export class DomainException extends Error {
  code: DomainExceptionCode;
  extensions: Extension[];

  constructor(errorInfo: {
    code: DomainExceptionCode;
    extensions?: Extension[];
  }) {
    super();
    this.code = errorInfo.code;
    this.extensions = errorInfo.extensions || [];
  }
}
