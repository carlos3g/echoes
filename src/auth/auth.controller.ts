import { Public } from '@app/auth/decorators/public.decorator';
import { ForgotPasswordInput } from '@app/auth/dtos/forgot-password-input';
import { RefreshTokenInput } from '@app/auth/dtos/refresh-token-input';
import { ResetPasswordRequest } from '@app/auth/dtos/reset-password-request';
import { SignInInput } from '@app/auth/dtos/sign-in-input';
import { SignUpInput } from '@app/auth/dtos/sign-up-input';
import { ForgotPasswordUseCase } from '@app/auth/use-cases/forgot-password.use-case';
import { RefreshTokenUseCase } from '@app/auth/use-cases/refresh-token.use-case';
import { ResetPasswordUseCase } from '@app/auth/use-cases/reset-password.use-case';
import { SignInUseCase } from '@app/auth/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@app/auth/use-cases/sign-up.use-case';
import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

const TWO_MINUTES_IN_MS = 2 * 60 * 1000;

@Public()
@Controller('auth')
export class AuthController {
  public constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() input: SignInInput) {
    return this.signInUseCase.handle(input);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  public async signUp(@Body() input: SignUpInput) {
    return this.signUpUseCase.handle(input);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body() input: RefreshTokenInput) {
    return this.refreshTokenUseCase.handle(input);
  }

  // see: https://stackoverflow.com/a/1102817/13274020
  @Throttle({
    default: {
      limit: 3,
      ttl: TWO_MINUTES_IN_MS,
    },
  })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public async forgotPassword(@Body() input: ForgotPasswordInput) {
    return this.forgotPasswordUseCase.handle(input);
  }

  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() input: ResetPasswordRequest, @Param('token') token: string) {
    return this.resetPasswordUseCase.handle({
      ...input,
      token,
    });
  }
}
