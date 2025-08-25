import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users-repository.service';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersRepository.findAll();
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
