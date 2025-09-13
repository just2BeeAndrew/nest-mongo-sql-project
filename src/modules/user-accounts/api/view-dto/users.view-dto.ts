export class UsersViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(user: any): UsersViewDto {
    console.log("user",user);
    const dto = new UsersViewDto();

    dto.id = user.id.toString();
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.created_at.toISOString();

    return dto;
  }
}
