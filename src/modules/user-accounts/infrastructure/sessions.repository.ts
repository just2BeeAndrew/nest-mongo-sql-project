import { Injectable } from '@nestjs/common';
import { CreateSessionDomainDto } from '../domain/dto/create-session.domain.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionsRepository {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  async findSessionById(deviceId: string) {
    return await this.datasource.query(
      'SELECT 1 FROM "Sessions" WHERE device_id = $1 LIMIT 1',
      [deviceId],
    );
  }

  async createSession(dto: CreateSessionDomainDto) {
    await this.datasource.query(
      `
        INSERT INTO "Sessions" (device_id, user_id, title, ip, iat, exp, deleted_at)
        VALUES ($1, $2, $3, $4, $5, $6, NULL)
      `,
      [dto.deviceId, dto.userId, dto.title, dto.ip, dto.iat, dto.exp],
    );
  }

  async setSession(deviceId: string, iat: number, exp: number) {
    await this.datasource.query(
      `
      UPDATE "Sessions" SET iat = $1, exp = $2 WHERE device_id = $3
      `,
      [iat, exp, deviceId],
    );
  }
}
