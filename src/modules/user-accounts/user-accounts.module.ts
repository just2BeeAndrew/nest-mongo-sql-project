import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationsModule } from '../notifications/notifications.module';
import { PasswordRecoveryUseCase } from './application/usecases/password-recovery.usecase';
import { AuthController } from './api/auth.controller';
import { BcryptModule } from '../bcrypt/bcrypt.module';

const useCases = [PasswordRecoveryUseCase];

@Module({
  imports: [CqrsModule, NotificationsModule, BcryptModule],
  controllers: [UsersController, AuthController],
  providers: [UsersRepository, ...useCases],
})
export class UserAccountsModule {}
