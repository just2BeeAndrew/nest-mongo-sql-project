import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessContextDto } from '../../dto/access-context.dto';

export const ExtractOptionalUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): AccessContextDto | null => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      return null;
    }

    return user;
  }
)