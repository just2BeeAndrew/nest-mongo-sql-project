export class MeViewDto {
  login: string;
  email: string;
  userId: string;

  static mapToView(user: any): MeViewDto {
    const dto = new MeViewDto();

    dto.login = user.accountData.login;
    dto.email = user.accountData.email;
    dto.userId = user._id.toString();

    return dto;
  }
}