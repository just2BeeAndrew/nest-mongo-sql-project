import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { AccountData } from '../domain/entities/account-data.entity';
import { EmailConfirmation } from '../domain/entities/email-confirmation.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(AccountData)
    private accountDataRepository: Repository<AccountData>,
    @InjectRepository(EmailConfirmation)
    private emailConfirmationRepository: Repository<EmailConfirmation>,
  ) {}

  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({
      where: {
        id,
        accountData: {
          deletedAt: IsNull(),
        },
      },
      relations: {
        accountData: true,
        emailConfirmation: true,
      },
    });
  }

  async isLoginTaken(login: string): Promise<boolean> {
    return await this.accountDataRepository.exists({
      where: {
        login,
        deletedAt: IsNull(),
      },
    });
  }

  async isEmailTaken(email: string): Promise<boolean> {
    return await this.accountDataRepository.exists({
      where: {
        email,
        deletedAt: IsNull(),
      },
    });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        accountData: {
          email,
          deletedAt: IsNull(),
        },
      },
      relations: {
        accountData: true,
        emailConfirmation: true,
      },
      select: {
        id: true,
        accountData: {
          login: true,
          email: true,
          createdAt: true,
          deletedAt: true,
        },
        emailConfirmation: {
          confirmationCode: true,
          recoveryCode: true,
          issuedAt: true,
          expirationTime: true,
          isConfirmed: true,
        },
      },
    });
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return await this.usersRepository.findOne({
      where: [
        {
          accountData: {
            login: loginOrEmail,
          },
        },
        {
          accountData: {
            email: loginOrEmail,
          },
        },
      ],
      relations: {
        accountData: true,
        emailConfirmation: true,
      },
    });
  }

  async findByRecoveryCode(code: string) {
    return await this.usersRepository.findOne({
      where: {
        accountData: {
          deletedAt: IsNull(),
        },
        emailConfirmation: {
          recoveryCode: code,
        },
      },
      relations: {
        accountData: true,
        emailConfirmation: true,
      },
    });
  }

  async findByConfirmationCode(code: string) {
    return await this.usersRepository.findOne({
      where: {
        accountData: {
          deletedAt: IsNull(),
        },
        emailConfirmation: {
          confirmationCode: code,
        },
      },
      relations: {
        accountData: true,
        emailConfirmation: true,
      },
    });
  }

  async setConfirmation(id: string) {
    await this.emailConfirmationRepository.update(
      { userId: id },
      { isConfirmed: true },
    );
  }

  async updateRecoveryCode(id: string, recoveryCode: string) {
    await this.emailConfirmationRepository.update(
      { userId: id },
      { recoveryCode: recoveryCode },
    );
  }

  async setConfirmationCode(id: string, code: string) {
    await this.emailConfirmationRepository.update(
      { userId: id },
      { confirmationCode: code },
    );
  }

  async setPasswordHash(id: string, passwordHash: string) {
    await this.accountDataRepository.update(
      { userId: id },
      { passwordHash: passwordHash },
    );
  }

  async softDeleteUser(id: string) {
    return await this.accountDataRepository.softDelete({ userId: id });
  }

  async deleteUser(id: string) {
    await this.usersRepository.delete(id);
  }
}
