export class UsersViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(user: any): UsersViewDto {
    const dto = new UsersViewDto();

    dto.id = user.id;
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt;

    return dto;
  }
}
