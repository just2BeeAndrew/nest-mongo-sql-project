import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.dataSource.query(
      'SELECT u.user_id, ad.login, ad.email, ad.created_at\n' +
        'FROM "Users" u \n' +
        'JOIN "AccountData" ad ON u.user_id = ad.user_id',
    );

    return users.map(e =>{
      return {
        id: e.user_id,
        login: e.login,
        email: e.email,
        createdAt: e.created_at,
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
