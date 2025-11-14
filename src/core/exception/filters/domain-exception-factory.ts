import { DomainExceptionCode } from './domain-exception-codes';
import { DomainException } from './domain-exception';

export class DomainExceptionFactory {
  static notFound(field?: string, message: string = 'Not found') {
    return new DomainException({
      code: DomainExceptionCode.NotFound,
      extension: field ? [{ message, field }] : [], //field опциональный, тернарное выражение если значение field отсутствует то вернет пустой массив []
    });
  }

  static forbidden(field?: string, message: string = 'Forbidden') {
    return new DomainException({
      code: DomainExceptionCode.Forbidden,
      extension: field ? [{ message, field }] : [], //field опциональный, тернарное выражение если значение field отсутствует то вернет пустой массив []
    });
  }
}
