import { AuthServiceContract } from '@app/auth/contracts/auth-service.contract';
import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { JwtServiceContract } from '@app/auth/contracts/jwt-service.contract';
import { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { PrismaPasswordChangeRequestRepository } from '@app/auth/repositories/prisma-password-change-request.repository';
import { AuthService } from '@app/auth/services/auth.service';
import { BCryptService } from '@app/auth/services/bcrypt.service';
import { DeleteUsedPasswordChangeRequestTask } from '@app/auth/tasks/delete-used-password-change-request.task';
import { ForgotPasswordUseCase } from '@app/auth/use-cases/forgot-password.use-case';
import { RefreshTokenUseCase } from '@app/auth/use-cases/refresh-token.use-case';
import { ResetPasswordUseCase } from '@app/auth/use-cases/reset-password.use-case';
import { SignInUseCase } from '@app/auth/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@app/auth/use-cases/sign-up.use-case';
import { EmailModule } from '@app/email/email.module';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import type { EnvVariables } from '@app/shared/types';
import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVariables>) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    UserModule,
    PrismaModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    { provide: AuthServiceContract, useClass: AuthService },
    { provide: HashServiceContract, useClass: BCryptService },
    { provide: JwtServiceContract, useClass: JwtService },
    { provide: PasswordChangeRequestRepositoryContract, useClass: PrismaPasswordChangeRequestRepository },
    SignInUseCase,
    SignUpUseCase,
    RefreshTokenUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    DeleteUsedPasswordChangeRequestTask,
  ],
  exports: [AuthServiceContract, JwtServiceContract],
})
export class AuthModule {}
