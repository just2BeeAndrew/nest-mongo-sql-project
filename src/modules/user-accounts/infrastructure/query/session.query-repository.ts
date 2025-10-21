import { Injectable } from '@nestjs/common';
import { SessionsViewDto } from '../../api/view-dto/sessions.view-dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Session } from '../../domain/entities/session.entity';

@Injectable()
export class SessionsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
  ) {}

  async getAllSessions(userId: string): Promise<SessionsViewDto[]> {
    const sessions = await this.sessionRepository.find({
      where: { userId: userId },
    });

    return sessions.map((session) => SessionsViewDto.mapToView(session));
  }
}
