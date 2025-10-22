import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../../core/constants/auth-tokens.inject-constants';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainException } from '../../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../../core/exception/filters/domain-exception-codes';

export class RefreshTokenCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessTokenJwtService: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshTokenJwtService: JwtService,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.sessionsRepository.findSessionById(
      command.deviceId,
    );
    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        extension: [{ message: 'Session not found', field: 'session' }],
      });
    }

    const accessToken = this.accessTokenJwtService.sign({
      id: command.userId,
    });

    const refreshToken = this.refreshTokenJwtService.sign({
      id: command.userId,
      deviceId: command.deviceId,
    });

    const refreshPayload = this.refreshTokenJwtService.decode(refreshToken);

    await this.sessionsRepository.setSession(
      command.deviceId,
      refreshPayload.iat,
      refreshPayload.exp,
    );

    return { accessToken, refreshToken };
  }
}
