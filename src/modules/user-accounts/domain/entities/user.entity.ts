import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountData } from './account-data.entity';
import { EmailConfirmation } from './email-confirmation.entity';

@Entity()
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
}

