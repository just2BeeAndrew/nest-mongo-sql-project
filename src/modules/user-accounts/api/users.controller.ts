import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { FindUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../application/queries/find-all-users.query-handler';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UsersViewDto } from './view-dto/users.view-dto';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { BasicAuthGuard } from '../../../core/guards/basic/basic-auth.guard';
import { CreateUserByAdminCommand } from '../application/usecases/create-user-by-admin.usecase';
import { FindUserByIdQuery } from '../application/queries/find-user-by-id.query-handler';
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase';

@Controller('sa/users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly usersRepository: UsersRepository
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserInputDto) {
    const userId = await this.commandBus.execute<CreateUserByAdminCommand,string>(new CreateUserByAdminCommand(body));

    return this.queryBus.execute(new FindUserByIdQuery(userId));
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAllUsers(@Query() query: FindUsersQueryParams): Promise<PaginatedViewDto<UsersViewDto[]>> {
    return this.queryBus.execute(new FindAllUsersQuery(query));
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.commandBus.execute<DeleteUserCommand>(new DeleteUserCommand(id) );
  }
}
