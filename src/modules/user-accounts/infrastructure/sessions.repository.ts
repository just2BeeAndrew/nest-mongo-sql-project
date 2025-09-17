import { Injectable } from '@nestjs/common';
import { CreateSessionDomainDto } from '../domain/dto/create-session.domain.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findSessionById(deviceId: string) {
    console.log(deviceId);
    const session = await this.dataSource.query(
      'SELECT * FROM "Sessions" WHERE device_id = $1 LIMIT 1',
      [deviceId],
    );

    return session[0] || null;
  }

  async createSession(dto: CreateSessionDomainDto) {
    await this.dataSource.query(
      `
        INSERT INTO "Sessions" (device_id, user_id, title, ip, iat, exp, deleted_at)
        VALUES ($1, $2, $3, $4, $5, $6, NULL)
      `,
      [dto.deviceId, dto.userId, dto.title, dto.ip, dto.iat, dto.exp],
    );
  }

  async setSession(deviceId: string, iat: number, exp: number) {
    await this.dataSource.query(
      `
      UPDATE "Sessions" SET iat = $1, exp = $2 WHERE device_id = $3
      `,
      [iat, exp, deviceId],
    );
  }

  async softDeleteSession(deviceId: string) {
    return this.dataSource.query(
      `
      UPDATE "Sessions" SET deleted_at = NOW() WHERE id = $1
      `,
      [deviceId],
    );
  }

  async softDeleteSessionExcludeCurrent(userId: string, deviceId: string) {
    return await this.dataSource.query(
      `
    DELETE FROM "Session"  WHERE user_id = $1 AND device_id <> $2;
    `,
      [userId, deviceId],
    );
  }
}
