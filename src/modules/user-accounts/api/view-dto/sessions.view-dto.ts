import { SessionDocument } from '../../domain/sessions.entity';

export class SessionsViewDto {
  ip: string
  title: string
  lastActiveDate: string
  deviceId: string

  static mapToView(session: SessionDocument): SessionsViewDto{
    const dto = new SessionsViewDto();
    dto.ip = session.ip
    dto.title = session.title
    dto.lastActiveDate = new Date(session.iat * 1000).toISOString()
    dto.deviceId= session._id.toString();

    return dto;
  }

}

