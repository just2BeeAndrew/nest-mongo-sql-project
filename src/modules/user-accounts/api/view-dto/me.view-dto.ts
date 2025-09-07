import { UserDocument } from '../../domain/users.entity';

export class MeViewDto {
  login: string;
  email: string;
  userId: string;

  static mapToView(user: UserDocument): MeViewDto {
    const dto = new MeViewDto();

    dto.login = user.accountData.login;
    dto.email = user.accountData.email;
    dto.userId = user._id.toString();

    return dto;
  }
}