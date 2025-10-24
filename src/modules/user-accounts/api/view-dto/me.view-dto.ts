import { User } from '../../domain/entities/user.entity';

export class MeViewDto {
  login: string;
  email: string;
  userId: string;

  static mapToView(user: User): MeViewDto {
    const dto = new MeViewDto();

    dto.login = user.accountData.login;
    dto.email = user.accountData.email;
    dto.userId = user.id.toString();

    return dto;
  }
}