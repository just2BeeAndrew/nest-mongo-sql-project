import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus, Query,
} from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { QueryBus } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../application/queries/find-all-users.query-handler';

@Controller('users')
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly usersRepository: UsersRepository
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllUsers(@Query() query: GetUsersQueryParams) {
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
