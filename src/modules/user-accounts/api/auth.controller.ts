import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { QueryBus } from '@nestjs/cqrs';
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
import { RegistrationConfirmationCommand } from '../application/usecases/registration-confirmation.usecase';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { RegistrationCommand } from '../application/usecases/registration.usecase';
import { RegistrationEmailResendingInputDto } from './input-dto/registration-email-resending.input-dto';
import { RegistrationEmailResendingCommand } from '../application/usecases/registration-email-resending-commnad';
import { LogoutCommand } from '../application/usecases/logout.usecase';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../core/guards/bearer/jwt-auth.guard';
import { MeViewDto } from './view-dto/me.view-dto';
import { MeQuery } from '../application/queries/me.query-handler';
import { CustomThrottlerGuard } from '../../../core/guards/throttler.guard';

@UseGuards(CustomThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
        extensions: [{ message: 'Header not found', field: ' Header' }],
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

  @SkipThrottle()
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
    return this.commandBus.execute<NewPasswordCommand>(
      new NewPasswordCommand(body),
    );
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() code: ConfirmationCodeInputDto) {
    return this.commandBus.execute<RegistrationConfirmationCommand>(
      new RegistrationConfirmationCommand(code.code),
    );
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: CreateUserInputDto) {
    return this.commandBus.execute<RegistrationCommand>(
      new RegistrationCommand(body),
    );
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() body: RegistrationEmailResendingInputDto,
  ) {
    return this.commandBus.execute<RegistrationEmailResendingCommand>(
      new RegistrationEmailResendingCommand(body.email),
    );
  }
  @SkipThrottle()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshAuthGuard)
  async logout(
    @ExtractUserFromRefreshToken() user: RefreshContextDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.commandBus.execute<LogoutCommand>(
      new LogoutCommand(user.id, user.deviceId),
    );
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  }

  @SkipThrottle()
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(
    @ExtractUserFromAccessToken() user: AccessContextDto,
  ): Promise<MeViewDto> {
    return this.queryBus.execute(new MeQuery(user.id));
  }
}
