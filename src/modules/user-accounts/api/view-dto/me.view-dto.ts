export class MeViewDto {
  login: string;
  email: string;
  userId: string;

  static mapToView(user: any): MeViewDto {
    const dto = new MeViewDto();

    dto.login = user.login;
    dto.email = user.email;
    dto.userId = user.id.toString();

    return dto;
  }
}