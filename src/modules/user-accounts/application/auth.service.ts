import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { JwtService } from '@nestjs/jwt';
import { AccessContextDto } from '../../../core/dto/access-context.dto';
import { BcryptService } from '../../bcrypt/application/bcrypt.service';

import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../notifications/application/email.service';


@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<AccessContextDto | null> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }

    if (!user.emailConfirmation.isConfirmed) {
      return null;
    }

    const isPasswordValid = await this.bcryptService.comparePassword({
      password: password,
      hash: user.accountData.passwordHash,
    });

    if (!isPasswordValid) {
      return null;
    }

    return { id: user._id.toString() };
  }
}
