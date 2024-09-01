import { Public } from '@app/auth/decorators/public.decorator';
import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { ChangePasswordRequest } from '@app/auth/dtos/change-password-request';
import { ForgotPasswordInput } from '@app/auth/dtos/forgot-password-input';
import { RefreshTokenInput } from '@app/auth/dtos/refresh-token-input';
import { ResetPasswordRequest } from '@app/auth/dtos/reset-password-request';
import { SignInInput } from '@app/auth/dtos/sign-in-input';
import { SignUpRequest } from '@app/auth/dtos/sign-up-request';
import { UpdateMeRequest } from '@app/auth/dtos/update-me-request';
import { AvatarDimensionsValidationPipe } from '@app/auth/pipes/avatar-dimensions-validation.pipe';
import { ChangePasswordUseCase } from '@app/auth/use-cases/change-password.use-case';
import { ForgotPasswordUseCase } from '@app/auth/use-cases/forgot-password.use-case';
import { RefreshTokenUseCase } from '@app/auth/use-cases/refresh-token.use-case';
import { ResetPasswordUseCase } from '@app/auth/use-cases/reset-password.use-case';
import { SignInUseCase } from '@app/auth/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@app/auth/use-cases/sign-up.use-case';
import { UpdateAvatarUseCase } from '@app/auth/use-cases/update-avatar.use-case';
import { UpdateMeUseCase } from '@app/auth/use-cases/update-me.use-case';
import { User } from '@app/user/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

const TWO_MINUTES_IN_MS = 2 * 60 * 1000;
const MAX_AVATAR_SIZE_IN_BYTES = 2 * 1024 * 1024;
const AVATAR_VALID_MIME_TYPES = 'image/*';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly updateAvatarUseCase: UpdateAvatarUseCase,
    private readonly updateMeUseCase: UpdateMeUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase
  ) {}

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() input: SignInInput) {
    return this.signInUseCase.handle(input);
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  public async signUp(
    @Body() input: SignUpRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: AVATAR_VALID_MIME_TYPES,
        })
        .addMaxSizeValidator({
          maxSize: MAX_AVATAR_SIZE_IN_BYTES,
        })
        .addValidator(new AvatarDimensionsValidationPipe())
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        })
    )
    avatar?: Express.Multer.File
  ) {
    return this.signUpUseCase.handle({ ...input, avatar });
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body() input: RefreshTokenInput) {
    return this.refreshTokenUseCase.handle(input);
  }

  @Public()
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

  @Public()
  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() input: ResetPasswordRequest, @Param('token') token: string) {
    return this.resetPasswordUseCase.handle({
      ...input,
      token,
    });
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  public getMe(@UserDecorator() user: User) {
    return user;
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  public async updateMe(@Body() input: UpdateMeRequest, @UserDecorator() user: User) {
    return this.updateMeUseCase.handle({ ...input, user });
  }

  @Patch('me/avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  public updateAvatar(
    @UserDecorator() user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: AVATAR_VALID_MIME_TYPES,
        })
        .addMaxSizeValidator({
          maxSize: MAX_AVATAR_SIZE_IN_BYTES,
        })
        .addValidator(new AvatarDimensionsValidationPipe())
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    avatar: Express.Multer.File
  ) {
    return this.updateAvatarUseCase.handle({ user, avatar });
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  public async changePassword(@Body() input: ChangePasswordRequest, @UserDecorator() user: User) {
    return this.changePasswordUseCase.handle({ ...input, user });
  }
}
