import { Injectable } from '@nestjs/common';
import { SessionsViewDto } from '../../api/view-dto/sessions.view-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getAllSessions(userId: string): Promise<SessionsViewDto[]> {
    const sessions = await this.dataSource.query(`
      SELECT *
      FROM "Sessions"
      WHERE user_id = $1
    `, [userId])

    const sessionDtos = sessions.map((session) =>
      SessionsViewDto.mapToView(session),
    );

    return sessionDtos;
  }
}
