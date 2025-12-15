import { Public } from '@app/auth/decorators/public.decorator';
import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { AuthorPaginatedQuery } from '@app/author/dtos/author-paginated-query';
import { TagAuthorRequest } from '@app/author/dtos/tag-author-request';
import { FavoriteAuthorUseCase } from '@app/author/use-cases/favorite-author.use-case';
import { GetOneAuthorUseCase } from '@app/author/use-cases/get-one-author.use-case';
import { ListAuthorPaginatedUseCase } from '@app/author/use-cases/list-author-paginated.use-case';
import { TagAuthorUseCase } from '@app/author/use-cases/tag-author.use-case';
import { UnfavoriteAuthorUseCase } from '@app/author/use-cases/unfavorite-author.use-case';
import { UntagAuthorUseCase } from '@app/author/use-cases/untag-author.use-case';
import { User } from '@app/user/entities/user.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({ path: 'authors', version: '1' })
export class AuthorController {
  public constructor(
    private readonly listAuthorPaginatedUseCase: ListAuthorPaginatedUseCase,
    private readonly getOneAuthorUseCase: GetOneAuthorUseCase,
    private readonly favoriteAuthorUseCase: FavoriteAuthorUseCase,
    private readonly unfavoriteAuthorUseCase: UnfavoriteAuthorUseCase,
    private readonly tagAuthorUseCase: TagAuthorUseCase,
    private readonly untagAuthorUseCase: UntagAuthorUseCase
  ) {}

  @Public()
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: AuthorPaginatedQuery) {
    return this.listAuthorPaginatedUseCase.handle(params);
  }

  @Public()
  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  public async show(@Param('uuid') uuid: string) {
    return this.getOneAuthorUseCase.handle({ uuid });
  }

  @ApiBearerAuth()
  @Post(':uuid/favorite')
  @HttpCode(HttpStatus.OK)
  public async favorite(@Param('uuid') uuid: string, @UserDecorator() user: User) {
    return this.favoriteAuthorUseCase.handle({ authorUuid: uuid, user });
  }

  @ApiBearerAuth()
  @Post(':uuid/unfavorite')
  @HttpCode(HttpStatus.OK)
  public async unfavorite(@Param('uuid') uuid: string, @UserDecorator() user: User) {
    return this.unfavoriteAuthorUseCase.handle({ authorUuid: uuid, user });
  }

  @ApiBearerAuth()
  @Post(':uuid/tag')
  @HttpCode(HttpStatus.OK)
  public async tag(@Param('uuid') uuid: string, @UserDecorator() user: User, @Body() input: TagAuthorRequest) {
    return this.tagAuthorUseCase.handle({ authorUuid: uuid, user, tagUuid: input.tagUuid });
  }

  @ApiBearerAuth()
  @Post(':uuid/untag')
  @HttpCode(HttpStatus.OK)
  public async untag(@Param('uuid') uuid: string, @UserDecorator() user: User, @Body() input: TagAuthorRequest) {
    return this.untagAuthorUseCase.handle({ authorUuid: uuid, user, tagUuid: input.tagUuid });
  }
}
