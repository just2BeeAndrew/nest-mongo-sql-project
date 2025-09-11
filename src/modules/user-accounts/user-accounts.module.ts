import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationsModule } from '../notifications/notifications.module';
import { PasswordRecoveryUseCase } from './application/usecases/password-recovery.usecase';
import { AuthController } from './api/auth.controller';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { CreateUserByAdminUseCase } from './application/usecases/create-user-by-admin.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase';
import { SetConfirmationUseCase } from './application/usecases/set-confirmation.usecase';
import { FindAllUsersQueryHandler } from './application/queries/find-all-users.query-handler';
import { FindUserByIdQueryHandler } from './application/queries/find-user-by-id.query-handler';
import { RefreshTokenUseCase } from './application/usecases/refresh-token.usecase';
import { RegistrationUseCase } from './application/usecases/registration.usecase';
import { RegistrationConfirmationUseCase } from './application/usecases/registration-confirmation.usecase';
import { RegistrationEmailResendingUseCase } from './application/usecases/registration-email-resending-commnad';
import { LogoutUseCase } from './application/usecases/logout.usecase';
import { MeQueryHandler } from './application/queries/me.query-handler';

const useCases = [
  CreateUserUseCase,
  CreateUserByAdminUseCase,
  DeleteUserUseCase,
  PasswordRecoveryUseCase,
  RefreshTokenUseCase,
  RegistrationUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  LogoutUseCase,
  SetConfirmationUseCase,
];

const queries = [
  FindAllUsersQueryHandler,
  FindUserByIdQueryHandler,
  MeQueryHandler,
];

@Module({
  imports: [CqrsModule, NotificationsModule, BcryptModule],
  controllers: [UsersController, AuthController],
  providers: [UsersRepository, ...useCases, ...queries],
})
export class UserAccountsModule {}
