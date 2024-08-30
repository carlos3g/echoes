import { Public } from '@app/auth/decorators/public.decorator';
import { GetUserAvatarUseCase } from '@app/user/use-cases/get-user-avatar.use-case';
import { Controller, Get, HttpCode, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('users')
export class UserController {
  public constructor(private readonly getUserAvatarUseCase: GetUserAvatarUseCase) {}

  @Public()
  @Get(':uuid.webp')
  @HttpCode(HttpStatus.OK)
  public show(@Param('uuid') uuid: string, @Res() response: Response) {
    return this.getUserAvatarUseCase.handle({ userUuid: uuid, response });
  }
}
