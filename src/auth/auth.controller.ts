import { RefreshTokenInput } from '@app/auth/dtos/refresh-token-input';
import { SignInInput } from '@app/auth/dtos/sign-in-input';
import { SignUpInput } from '@app/auth/dtos/sign-up-input';
import { RefreshTokenUseCase } from '@app/auth/use-cases/refresh-token.use-case';
import { SignInUseCase } from '@app/auth/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@app/auth/use-cases/sign-up.use-case';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() input: SignInInput) {
    return this.signInUseCase.handler(input);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  public async signUp(@Body() input: SignUpInput) {
    return this.signUpUseCase.handler(input);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body() input: RefreshTokenInput) {
    return this.refreshTokenUseCase.handler(input);
  }
}
