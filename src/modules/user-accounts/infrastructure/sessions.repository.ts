import { Injectable } from '@nestjs/common';
import { CreateSessionDomainDto } from '../domain/dto/create-session.domain.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionsRepository {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  async findSessionById() {}

  async createSession(dto: CreateSessionDomainDto){
    await this.datasource.query(
      `
        INSERT INTO "Sessions" (session_id, user_id, title, ip, iat, exp, deleted_at)
        VALUES ($1, $2, $3, $4, $5, $6, NULL)
      `, [dto.sessionId, dto.userId, dto.title, dto.ip, dto.iat, dto.exp]
    )
  }
}
