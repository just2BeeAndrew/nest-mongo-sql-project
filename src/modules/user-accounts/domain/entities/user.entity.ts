import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountData } from './account-data.entity';
import { EmailConfirmation } from './email-confirmation.entity';
import { Session } from './session.entity';
import { CreateUserDto } from '../dto/create-user.dto';

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

  @OneToMany(() => Session, (session) => session.user, { cascade: true })
  sessions: Session[];

  static create(dto: CreateUserDto) {
    const user = new User();

    const accountData = new AccountData();
    accountData.login = dto.login;
    accountData.email = dto.email;
    accountData.passwordHash = dto.passwordHash;

    accountData.user = user; //устанавливаю связь с User

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
}
