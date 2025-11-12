import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountData } from './account-data.entity';
import { EmailConfirmation } from './email-confirmation.entity';
import { Session } from './session.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { PostStatus } from '../../../bloggers-platform/domain/entities/post-status.entity';
import { Comment } from '../../../bloggers-platform/domain/entities/comment.entity';
import { CommentStatus } from '../../../bloggers-platform/domain/entities/comment-status.entity';
import { Player } from '../../../quiz-game/domain/entity/player.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => AccountData, (accountData) => accountData.user, {
    cascade: true,
  })
  accountData: AccountData;

  @OneToOne(
    () => EmailConfirmation,
    (emailConfirmation) => emailConfirmation.user,
    {
      cascade: true,
    },
  )
  emailConfirmation: EmailConfirmation;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => PostStatus, (postStatus) => postStatus.user)
  postStatus: PostStatus[];

  @OneToMany(() => Comment, (comments) => comments.user)
  comments: Comment[];

  @OneToMany(()=> CommentStatus, (commentStatus) => commentStatus.user)
  commentStatus: CommentStatus[];

  @OneToMany(()=> Player, (players) => players.user)
  players: Player[];

  //createdAt updated at deletedAt
  static create(dto: CreateUserDto) {
    const user = new User();

    const accountData = new AccountData();
    accountData.login = dto.login;
    accountData.email = dto.email;
    accountData.passwordHash = dto.passwordHash;

    accountData.user = user; //устанавливаю связь с User
    //разнести по сущностям
    const emailConfirmation = new EmailConfirmation();
    emailConfirmation.issuedAt = new Date();
    emailConfirmation.expirationTime = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    emailConfirmation.user = user;

    user.accountData = accountData;
    user.emailConfirmation = emailConfirmation;

    return user;
  }

  //TODO: вынести обновления
}
