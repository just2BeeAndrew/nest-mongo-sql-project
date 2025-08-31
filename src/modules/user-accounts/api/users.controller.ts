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
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../application/queries/find-all-users.query-handler';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UsersViewDto } from './view-dto/users.view-dto';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { BasicAuthGuard } from '../../../core/guards/basic/basic-auth.guard';
import { CreateUserByAdminCommand } from '../application/usecases/create-user-by-admin.usecase';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commamdBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly usersRepository: UsersRepository
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserInputDto) {
    const userId = await this.commamdBus.execute<CreateUserByAdminCommand,string>(new CreateUserByAdminCommand(body));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllUsers(@Query() query: GetUsersQueryParams): Promise<PaginatedViewDto<UsersViewDto[]>> {
    return this.queryBus.execute(new FindAllUsersQuery(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersRepository.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersRepository.remove(+id);
  }
}
