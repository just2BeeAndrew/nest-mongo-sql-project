import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { PasswordRecoveryCommand } from '../application/usecases/password-recovery.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
return this.commandBus.execute<PasswordRecoveryCommand>(new PasswordRecoveryCommand(body.email));
    //return this.authService.passwordRecovery(body.email);
  }
}
