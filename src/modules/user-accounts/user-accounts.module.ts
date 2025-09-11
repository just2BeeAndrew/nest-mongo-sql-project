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
import { GetAllSessionsQueryHandler } from './application/queries/get-all-sessions.query-heandler';
import { DeleteSessionByIdUseCase } from './application/usecases/delete-session-by-id.usecase';
import { DeleteSessionsExcludeCurrentUseCase } from './application/usecases/delete-sessions-exclude-current.usecase';
import { LoginUseCase } from './application/usecases/login.usecases';
import { NewPasswordUseCase } from './application/usecases/new-password.usecase';

const useCases = [
  CreateUserUseCase,
  CreateUserByAdminUseCase,
  DeleteSessionByIdUseCase,
  DeleteSessionsExcludeCurrentUseCase,
  DeleteUserUseCase,
  LoginUseCase,
  LogoutUseCase,
  NewPasswordUseCase,
  PasswordRecoveryUseCase,
  RefreshTokenUseCase,
  RegistrationUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  SetConfirmationUseCase,
];

const queries = [
  FindAllUsersQueryHandler,
  FindUserByIdQueryHandler,
  GetAllSessionsQueryHandler,
  MeQueryHandler,
];

@Module({
  imports: [CqrsModule, NotificationsModule, BcryptModule],
  controllers: [UsersController, AuthController],
  providers: [UsersRepository, ...useCases, ...queries],
})
export class UserAccountsModule {}
