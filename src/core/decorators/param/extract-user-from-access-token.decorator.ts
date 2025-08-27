import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessContextDto } from '../../dto/access-context.dto';

export const ExtractUserFromAccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext): AccessContextDto => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      throw new Error('there is no user');
    }

    return user;
  }
)