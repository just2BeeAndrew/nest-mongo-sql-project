import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { AccountData } from '../domain/entities/account-data.entity';
import { EmailConfirmation } from '../domain/entities/email-confirmation.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(AccountData)
    private accountDataRepository: Repository<AccountData>,
    @InjectRepository(EmailConfirmation)
    private emailConfirmationRepository: Repository<EmailConfirmation>,
  ) {
    super(
      usersRepository.target,
      usersRepository.manager,
      usersRepository.queryRunner,
    );
  }
  async saveUser(user: User) {
    return await this.save(user);
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

  async isEmailTaken(email: string, manager?: any): Promise<boolean> {
    return await this.accountDataRepository.exists({
      where: {
        email,
        deletedAt: IsNull(),
      },
    });
  }

  async findByLogin(login: string) {}

  async findByEmail(email: string) {
    const user = await this.dataSource.query(
      `
        SELECT u.id,
               a.login,
               a.email,
               a.created_at,
               a.deleted_at,
               e.confirmation_code,
               e.recovery_code,
               e.issued_at,
               e.expiration_date,
               e.is_confirmed
        FROM "Users" u
               JOIN "AccountData" a ON u.id = a.id
               LEFT JOIN "EmailConfirmation" e ON u.id = e.id
        WHERE a.email = $1
      `,
      [email],
    );

    return user[0] || null;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await this.dataSource.query(
      `
      SELECT *
      FROM "Users" u
             JOIN "AccountData" a ON u.id = a.id
             LEFT JOIN "EmailConfirmation" e ON u.id = e.id
      WHERE a.email = $1 OR a.login = $1
    `,
      [loginOrEmail],
    );
    return user[0] || null;
  }

  async findByRecoveryCode(recoveryCode: string) {
    return this.dataSource.query(
      `
      SELECT *
      FROM "Users" u
             JOIN "AccountData" a ON u.id = a.id
             LEFT JOIN "EmailConfirmation" e ON u.id = e.id
      WHERE e.recovery_code = $1 
      `,
      [recoveryCode],
    );
  }

  async findByConfirmationCode(code: string) {
    const user = await this.dataSource.query(
      `
        SELECT *
        FROM "Users" u
               JOIN "AccountData" a ON u.id = a.id
               LEFT JOIN "EmailConfirmation" e ON u.id = e.id
        WHERE e.confirmation_code = $1
      `,
      [code],
    );

    return user[0] || null;
  }

  async setConfirmation(id: string) {
    await this.emailConfirmationRepository.update(
      { userId: id },
      { isConfirmed: true },
    );
  }

  async updateRecoveryCode(id: string, recoveryCode: string) {
    await this.dataSource.query(
      'UPDATE "EmailConfirmation" SET recovery_code = $1 WHERE id = $2',
      [recoveryCode, id],
    );
  }

  async setConfirmationCode(id: string, code: string) {
    await this.dataSource.query(
      'UPDATE "EmailConfirmation" SET confirmation_code = $1 WHERE id = $2',
      [code, id],
    );
  }

  async setPasswordHash(id: string, passwordHash: string) {
    await this.dataSource.query(
      'UPDATE "AccountData" SET password_hash = $1 WHERE id = $2',
      [passwordHash, id],
    );
  }

  softDeleteUser(id: string) {
    return this.dataSource.query(
      `
        UPDATE "AccountData"
        SET deleted_at = NOW()
        WHERE id = $1
          AND deleted_at IS NULL RETURNING id
      `,
      [id],
    );
  }

  deleteUser(id: string) {
    return this.dataSource.query(
      `
    DELETE FROM "Users" WHERE id = $1 RETURNING id
    `,
      [id],
    );
  }
}
