import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsRepository {
  constructor() {}

  async findSessionById(deviceId: string) {}

  async createSession(){}
}
