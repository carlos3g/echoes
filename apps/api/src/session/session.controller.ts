import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { SyncSessionsBody } from '@app/session/dtos/sync-sessions.dto';
import { SyncSessionsUseCase } from '@app/session/use-cases/sync-sessions.use-case';
import type { User } from '@app/user/entities/user.entity';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller({ path: 'sessions', version: '1' })
export class SessionController {
  public constructor(private readonly syncSessionsUseCase: SyncSessionsUseCase) {}

  @Post('batch')
  @HttpCode(HttpStatus.OK)
  public async batch(@Body() body: SyncSessionsBody, @UserDecorator() user: User) {
    return this.syncSessionsUseCase.handle({ user, sessions: body.sessions });
  }
}
