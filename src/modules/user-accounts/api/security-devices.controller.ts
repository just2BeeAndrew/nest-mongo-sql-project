import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus, Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtRefreshAuthGuard } from '../../../core/guards/bearer/jwt-refresh-auth.guard';
import { ExtractUserFromRefreshToken } from '../../../core/decorators/param/extract-user-from-refresh-token.decorator';
import { RefreshContextDto } from '../../../core/dto/refresh-context-dto';
import { GetAllSessionsQuery } from '../application/queries/get-all-sessions.query-heandler';
import { DeleteSessionsExcludeCurrentCommand } from '../application/usecases/delete-sessions-exclude-current.usecase';
import { DeleteSessionByIdCommand } from '../application/usecases/delete-session-by-id.usecase';

@Controller('security')
export class SecurityDevicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('devices')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllSessions(@ExtractUserFromRefreshToken() user: RefreshContextDto) {
    return this.queryBus.execute(new GetAllSessionsQuery(user.id));
  }

  @Delete('devices')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSessionsExcludeCurrent(
    @ExtractUserFromRefreshToken() user: RefreshContextDto,
  ) {
    return this.commandBus.execute<DeleteSessionsExcludeCurrentCommand>(
      new DeleteSessionsExcludeCurrentCommand(user.id, user.deviceId),
    );
  }

  @Delete('devices/:deviceId')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSessionById(
    @ExtractUserFromRefreshToken() user: RefreshContextDto,
    @Param('deviceId') uriParam: string,
  ) {
    return this.commandBus.execute<DeleteSessionByIdCommand>(
      new DeleteSessionByIdCommand(user.id, user.deviceId, uriParam),
    );
  }
}
