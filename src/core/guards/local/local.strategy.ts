import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../../modules/user-accounts/application/auth.service';
import { AccessContextDto } from '../../dto/access-context.dto';
import { DomainException } from '../../exception/filters/domain-exception';
import { DomainExceptionCode } from '../../exception/filters/domain-exception-codes';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<AccessContextDto> {
    const user = await this.authService.validateUser(loginOrEmail, password);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        extension: [
          { message: 'Invalid login or password', field: 'login or password' },
        ],
      });
    }
    return user;
  }
}
