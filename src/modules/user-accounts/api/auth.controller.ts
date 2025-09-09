import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { PasswordRecoveryCommand } from '../application/usecases/password-recovery.usecase';
import { LocalAuthGuard } from '../../../core/guards/local/local-auth.guard';
import { ExtractUserFromAccessToken } from '../../../core/decorators/param/extract-user-from-access-token.decorator';
import { AccessContextDto } from '../../../core/dto/access-context.dto';
import { DomainException } from '../../../core/exception/filters/domain-exception';
import { DomainExceptionCode } from '../../../core/exception/filters/domain-exception-codes';
import { Request, Response } from 'express';
import { LoginCommand } from '../application/usecases/login.usecases';
import { JwtRefreshAuthGuard } from '../../../core/guards/bearer/jwt-refresh-auth.guard';
import { ExtractUserFromRefreshToken } from '../../../core/decorators/param/extract-user-from-refresh-token.decorator';
import { RefreshContextDto } from '../../../core/dto/refresh-context-dto';
import { RefreshTokenCommand } from '../application/usecases/refresh-token.usecase';
import { NewPasswordInputDto } from './input-dto/new-password.input-dto';
import { NewPasswordCommand } from '../application/usecases/new-password.usecase';
import { ConfirmationCodeInputDto } from './input-dto/confirmation-code.input-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    const title = req.headers['user-agent'];
    if (!title) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'Header not found', key: ' Header' }],
      });
    }

    const forwarded = req.headers['x-forwarded-for'] as string;
    const ipFromHeader = forwarded ? forwarded.split(',')[0].trim() : null;
    const ip =
      ipFromHeader || req.ip || req.socket.remoteAddress || 'IP не определён';

    const { accessToken, refreshToken } =
      await this.commandBus.execute<LoginCommand>(
        new LoginCommand({ userId: user.id }, title, ip),
      );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @ExtractUserFromRefreshToken() user: RefreshContextDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.commandBus.execute<RefreshTokenCommand>(
        new RefreshTokenCommand(user.id, user.deviceId),
      );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
    return this.commandBus.execute<PasswordRecoveryCommand>(
      new PasswordRecoveryCommand(body.email),
    );
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: NewPasswordInputDto) {
    return this.commandBus.execute<NewPasswordCommand>(new NewPasswordCommand(body));
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() code: ConfirmationCodeInputDto,
  ) {
    return this.commandBus.execute<RegistrationConfirmationCommand>(new RegistrationConfirmationCommand)
  }
}
