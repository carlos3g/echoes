import { AuthServiceContract, HashServiceContract, JwtServiceContract } from '@app/auth/contracts';
import { AuthService } from '@app/auth/services/auth.service';
import { BCryptService } from '@app/auth/services/bcrypt.service';
import { RefreshTokenUseCase } from '@app/auth/use-cases/refresh-token.use-case';
import { SignInUseCase } from '@app/auth/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@app/auth/use-cases/sign-up.use-case';
import { UsersModule } from '@app/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    { provide: AuthServiceContract, useClass: AuthService },
    { provide: HashServiceContract, useClass: BCryptService },
    { provide: JwtServiceContract, useClass: JwtService },
    SignInUseCase,
    SignUpUseCase,
    RefreshTokenUseCase,
  ],
})
export class AuthModule {}
