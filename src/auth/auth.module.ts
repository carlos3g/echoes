import {
  AuthServiceContract,
  HashServiceContract,
  JwtServiceContract,
  PasswordChangeRequestRepositoryContract,
} from '@app/auth/contracts';
import { PasswordChangeRequestRepository } from '@app/auth/repositories/password-change-request.repository';
import { AuthService } from '@app/auth/services/auth.service';
import { BCryptService } from '@app/auth/services/bcrypt.service';
import { ForgotPasswordUseCase } from '@app/auth/use-cases/forgot-password.use-case';
import { RefreshTokenUseCase } from '@app/auth/use-cases/refresh-token.use-case';
import { ResetPasswordUseCase } from '@app/auth/use-cases/reset-password.use-case';
import { SignInUseCase } from '@app/auth/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@app/auth/use-cases/sign-up.use-case';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import type { EnvVariables } from '@app/shared/types';
import { UsersModule } from '@app/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVariables>) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    { provide: AuthServiceContract, useClass: AuthService },
    { provide: HashServiceContract, useClass: BCryptService },
    { provide: JwtServiceContract, useClass: JwtService },
    { provide: PasswordChangeRequestRepositoryContract, useClass: PasswordChangeRequestRepository },
    SignInUseCase,
    SignUpUseCase,
    RefreshTokenUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
  ],
})
export class AuthModule {}
