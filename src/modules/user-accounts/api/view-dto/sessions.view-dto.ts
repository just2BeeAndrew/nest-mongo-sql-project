export class SessionsViewDto {
  ip: string
  title: string
  lastActiveDate: string
  deviceId: string

  static mapToView(session: any): SessionsViewDto{
    const dto = new SessionsViewDto();
    dto.ip = session.ip
    dto.title = session.title
    dto.lastActiveDate = new Date(session.iat * 1000).toISOString()
    dto.deviceId= session.deviceId.toString();

    return dto;
  }

}

