import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../user-accounts/domain/entities/user.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async deleteAll() {
    await this.dataSource.query(`TRUNCATE TABLE "User" CASCADE;`);
    await this.dataSource.query(`TRUNCATE TABLE "AccountData";`);
    await this.dataSource.query(`TRUNCATE TABLE "EmailConfirmation";`);
    await this.dataSource.query(`TRUNCATE TABLE "Session" CASCADE;`);
    await this.dataSource.query(`TRUNCATE TABLE "Blog" CASCADE;`);
  }
}
