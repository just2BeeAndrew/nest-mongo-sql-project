import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { DomainException } from '../../exception/filters/domain-exception';
import { DomainExceptionCode } from '../../exception/filters/domain-exception-codes';
import { SessionsRepository } from '../../../modules/user-accounts/infrastructure/sessions.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.refreshToken;
      },
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        extension: [
          { message: 'Refresh token expired', field: 'refreshToken' },
        ],
      });
    }

    const tokenExpiration = Math.floor(Date.now() / 1000);
    console.log(payload.iat, payload.exp, tokenExpiration);

    if (payload.exp && payload.exp < tokenExpiration) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        extension: [
          { message: 'Refresh token expired', field: 'refreshToken' },
        ],
      });
    }

    const session = await this.sessionsRepository.findSessionById(
      payload.deviceId,
    );

    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        extension: [{ message: 'Session not found', field: 'session' }],
      });
    }

    if (Number(session.iat) !== Number(payload.iat)) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        extension: [
          { message: 'Refresh token expired', field: 'refreshToken' },
        ],
      });
    }

    return payload;
  }
}
