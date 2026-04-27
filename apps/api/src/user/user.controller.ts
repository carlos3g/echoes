import { Public } from '@app/auth/decorators/public.decorator';
import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { Paginate } from '@app/shared/dtos/paginate';
import { SearchUsersQuery } from '@app/user/dtos/search-users-query';
import { User } from '@app/user/entities/user.entity';
import { FollowUserUseCase } from '@app/user/use-cases/follow-user.use-case';
import { GetUserAvatarUseCase } from '@app/user/use-cases/get-user-avatar.use-case';
import { GetUserProfileUseCase } from '@app/user/use-cases/get-user-profile.use-case';
import { ListFollowersUseCase } from '@app/user/use-cases/list-followers.use-case';
import { ListFollowingUseCase } from '@app/user/use-cases/list-following.use-case';
import { SaveFolderUseCase } from '@app/user/use-cases/save-folder.use-case';
import { SearchUsersUseCase } from '@app/user/use-cases/search-users.use-case';
import { SuggestedUsersUseCase } from '@app/user/use-cases/suggested-users.use-case';
import { UnfollowUserUseCase } from '@app/user/use-cases/unfollow-user.use-case';
import { UnsaveFolderUseCase } from '@app/user/use-cases/unsave-folder.use-case';
import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UserController {
  public constructor(
    private readonly getUserAvatarUseCase: GetUserAvatarUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly listFollowersUseCase: ListFollowersUseCase,
    private readonly listFollowingUseCase: ListFollowingUseCase,
    private readonly saveFolderUseCase: SaveFolderUseCase,
    private readonly unsaveFolderUseCase: UnsaveFolderUseCase,
    private readonly searchUsersUseCase: SearchUsersUseCase,
    private readonly suggestedUsersUseCase: SuggestedUsersUseCase
  ) {}

  @Public()
  @Get('search')
  @HttpCode(HttpStatus.OK)
  public async search(@Query() params: SearchUsersQuery) {
    return this.searchUsersUseCase.handle({ query: params.q, paginate: params });
  }

  @Public()
  @Get('suggested')
  @HttpCode(HttpStatus.OK)
  public async suggested(@Query() params: Paginate, @UserDecorator() user?: User) {
    return this.suggestedUsersUseCase.handle({ user, paginate: params });
  }

  @Public()
  @Get(':username/profile')
  @HttpCode(HttpStatus.OK)
  public async profile(@Param('username') username: string, @UserDecorator() user?: User) {
    return this.getUserProfileUseCase.handle({ username, currentUser: user });
  }

  @Public()
  @Get(':username/followers')
  @HttpCode(HttpStatus.OK)
  public async followers(@Param('username') username: string, @Query() params: Paginate) {
    return this.listFollowersUseCase.handle({ username, paginate: params });
  }

  @Public()
  @Get(':username/following')
  @HttpCode(HttpStatus.OK)
  public async following(@Param('username') username: string, @Query() params: Paginate) {
    return this.listFollowingUseCase.handle({ username, paginate: params });
  }

  @Post(':username/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async follow(@Param('username') username: string, @UserDecorator() user: User) {
    return this.followUserUseCase.handle({ user, targetUsername: username });
  }

  @Post(':username/unfollow')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async unfollow(@Param('username') username: string, @UserDecorator() user: User) {
    return this.unfollowUserUseCase.handle({ user, targetUsername: username });
  }

  @Post('folders/:folderUuid/save')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async saveFolder(@Param('folderUuid') folderUuid: string, @UserDecorator() user: User) {
    return this.saveFolderUseCase.handle({ user, folderUuid });
  }

  @Post('folders/:folderUuid/unsave')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async unsaveFolder(@Param('folderUuid') folderUuid: string, @UserDecorator() user: User) {
    return this.unsaveFolderUseCase.handle({ user, folderUuid });
  }

  @Public()
  @Get(':uuid.webp')
  @HttpCode(HttpStatus.OK)
  public show(@Param('uuid') uuid: string, @Res() response: Response) {
    return this.getUserAvatarUseCase.handle({ userUuid: uuid, response });
  }
}
