import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { DomainException } from '../../exception/filters/domain-exception';
import { DomainExceptionCode } from '../../exception/filters/domain-exception-codes';
import { SessionsRepository } from '../../../modules/user-accounts/infrastructure/sessions.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly sessionsRepository: SessionsRepository) {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.refreshToken;
      },
      ignoreExpiration: true,
      secretOrKey: 'refresh-token-secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refreshToken;
    console.log("Refresh token", req.cookies);
    console.log("payload",payload);
    if (!refreshToken) {
      console.log("нет токена");
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Unauthorized',
        extensions: [{ message: 'Refresh token expired', key: 'refreshToken' }],
      });
    }

    const tokenExpiration = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < tokenExpiration) {
      console.log("Протух");
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Refresh token expired',
        extensions: [{ message: 'Refresh token expired', key: 'refreshToken' }],
      });
    }

    const session = await this.sessionsRepository.findSessionById(
      payload.deviceId,
    );
    if (!session) {
      console.log("Session not found");
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Unauthorized',
        extensions: [{ message: 'Session not found', key: 'session' }],
      });
    }

    if (session.iat !== payload.iat) {
      console.log("Неверное время создания");
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Unauthorized',
        extensions: [{ message: 'Refresh token expired', key: 'refreshToken' }],
      });
    }

    return payload;
  }
}
