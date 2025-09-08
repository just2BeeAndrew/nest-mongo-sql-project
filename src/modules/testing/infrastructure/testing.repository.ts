import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async deleteAll() {
    return this.dataSource.query(
      `
      TRUNCATE TABLE "Users" CASCADE
      TRUNCATE TABLE "Sessions"
      `,
    );
  }
}
