import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
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
import { FindAllSessionsQueryHandler } from './application/queries/get-all-sessions.query-heandler';
import { DeleteSessionByIdUseCase } from './application/usecases/delete-session-by-id.usecase';
import { DeleteSessionsExcludeCurrentUseCase } from './application/usecases/delete-sessions-exclude-current.usecase';
import { LoginUseCase } from './application/usecases/login.usecases';
import { NewPasswordUseCase } from './application/usecases/new-password.usecase';
import { SessionsRepository } from './infrastructure/sessions.repository';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../core/constants/auth-tokens.inject-constants';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthService } from './application/auth.service';
import { SessionsQueryRepository } from './infrastructure/query/session.query-repository';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { LocalStrategy } from '../../core/guards/local/local.strategy';
import { JwtStrategy } from '../../core/guards/bearer/jwt.strategy';
import { JwtRefreshStrategy } from '../../core/guards/bearer/jwt-refresh.strategy';
import { SecurityDevicesController } from './api/security-devices.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AccountData,
  EmailConfirmation,
  User,
} from './domain/entities/user.entity';

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
  FindAllSessionsQueryHandler,
  MeQueryHandler,
];

@Module({
  imports: [
    NotificationsModule,
    BcryptModule,
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 5 }]),
    TypeOrmModule.forFeature([User, AccountData, EmailConfirmation]),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    AuthService,
    AuthQueryRepository,
    UsersRepository,
    UsersQueryRepository,
    SessionsRepository,
    SessionsQueryRepository,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    ...useCases,
    ...queries,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'access-token-secret',
          signOptions: { expiresIn: 10000 },
        });
      },
      inject: [],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'refresh-token-secret',
          signOptions: { expiresIn: 20000 },
        });
      },
      inject: [],
    },
  ],
  exports: [UsersRepository],
})
export class UserAccountsModule {}
