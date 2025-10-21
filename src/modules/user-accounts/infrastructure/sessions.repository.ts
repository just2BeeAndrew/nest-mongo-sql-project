import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Session } from '../domain/entities/session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async saveSession(session: Session) {
    return await this.sessionRepository.save(session);
  }

  async findSessionById(deviceId: string) {
    return await this.sessionRepository.findOne({
      where: {
        deviceId: deviceId,
      },
    });
  }

  async setSession(deviceId: string, iat: number, exp: number) {
    await this.sessionRepository.update(
      { deviceId: deviceId },
      { iat: new Date(iat * 1000), exp: new Date(exp) },
    );
  }

  async deleteSession(deviceId: string) {
    await this.sessionRepository.delete(deviceId);
  }

  async deleteSessionExcludeCurrent(userId: string, deviceId: string) {
    await this.sessionRepository.delete({
      userId: userId,
      deviceId: Not(deviceId),
    });
  }
}
