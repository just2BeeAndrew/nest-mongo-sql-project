export class LikeDetails {
  addedAt: string;
  userId: string | null;
  login: string | null ;

  constructor(createdAt: Date, userId: string | null, login: string | null) {
    this.addedAt = createdAt.toISOString();
    this.userId = userId;
    this.login = login;
  }
}