export class UserRaw {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
}

export class UsersViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(user: UserRaw): UsersViewDto {
    const dto = new UsersViewDto();

    dto.id = user.id;
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
}
