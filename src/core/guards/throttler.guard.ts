import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { DomainException } from '../exception/filters/domain-exception';
import { DomainExceptionCode } from '../exception/filters/domain-exception-codes';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail,): Promise<void> {
    throw new DomainException({
      code: DomainExceptionCode.TooManyRequests,
    });
  }
}