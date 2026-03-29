import { Public } from '@app/auth/decorators/public.decorator';
import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { QuotePaginatedQuery } from '@app/quote/dtos/quote-paginated-query';
import { ShareQuoteRequest } from '@app/quote/dtos/share-quote-request';
import { TagQuoteRequest } from '@app/quote/dtos/tag-quote-request';
import { FavoriteQuoteUseCase } from '@app/quote/use-cases/favorite-quote.use-case';
import { GetOneQuoteUseCase } from '@app/quote/use-cases/get-one-quote.use-case';
import { IsQuoteTaggedUseCase } from '@app/quote/use-cases/is-quote-tagged.use-case';
import { ListQuotePaginatedUseCase } from '@app/quote/use-cases/list-quote-paginated.use-case';
import { ShareQuoteUseCase } from '@app/quote/use-cases/share-quote.use-case';
import { TagQuoteUseCase } from '@app/quote/use-cases/tag-quote.use-case';
import { UnfavoriteQuoteUseCase } from '@app/quote/use-cases/unfavorite-quote.use-case';
import { UntagQuoteUseCase } from '@app/quote/use-cases/untag-quote.use-case';
import { User } from '@app/user/entities/user.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({ path: 'quotes', version: '1' })
export class QuoteController {
  public constructor(
    private readonly listQuotePaginatedUseCase: ListQuotePaginatedUseCase,
    private readonly getOneQuoteUseCase: GetOneQuoteUseCase,
    private readonly favoriteQuoteUseCase: FavoriteQuoteUseCase,
    private readonly unfavoriteQuoteUseCase: UnfavoriteQuoteUseCase,
    private readonly tagQuoteUseCase: TagQuoteUseCase,
    private readonly untagQuoteUseCase: UntagQuoteUseCase,
    private readonly isQuoteTaggedUseCase: IsQuoteTaggedUseCase,
    private readonly shareQuoteUseCase: ShareQuoteUseCase
  ) {}

  @Public()
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: QuotePaginatedQuery, @UserDecorator() user: User) {
    return this.listQuotePaginatedUseCase.handle({ ...params, user });
  }

  @Public()
  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  public async show(@Param('uuid') uuid: string, @UserDecorator() user: User) {
    return this.getOneQuoteUseCase.handle({ uuid, user });
  }

  @ApiBearerAuth()
  @Post(':uuid/favorite')
  @HttpCode(HttpStatus.OK)
  public async favorite(@Param('uuid') uuid: string, @UserDecorator() user: User) {
    return this.favoriteQuoteUseCase.handle({ quoteUuid: uuid, user });
  }

  @ApiBearerAuth()
  @Post(':uuid/unfavorite')
  @HttpCode(HttpStatus.OK)
  public async unfavorite(@Param('uuid') uuid: string, @UserDecorator() user: User) {
    return this.unfavoriteQuoteUseCase.handle({ quoteUuid: uuid, user });
  }

  @ApiBearerAuth()
  @Post(':uuid/tag')
  @HttpCode(HttpStatus.OK)
  public async tag(@Param('uuid') uuid: string, @UserDecorator() user: User, @Body() input: TagQuoteRequest) {
    return this.tagQuoteUseCase.handle({ quoteUuid: uuid, user, tagUuid: input.tagUuid });
  }

  @ApiBearerAuth()
  @Post(':uuid/untag')
  @HttpCode(HttpStatus.OK)
  public async untag(@Param('uuid') uuid: string, @UserDecorator() user: User, @Body() input: TagQuoteRequest) {
    return this.untagQuoteUseCase.handle({ quoteUuid: uuid, user, tagUuid: input.tagUuid });
  }

  @ApiBearerAuth()
  @Post(':uuid/share')
  @HttpCode(HttpStatus.OK)
  public async share(@Param('uuid') uuid: string, @UserDecorator() user: User, @Body() input: ShareQuoteRequest) {
    return this.shareQuoteUseCase.handle({ quoteUuid: uuid, user, ...input });
  }

  @ApiBearerAuth()
  @Get(':uuid/tags/:tagUuid/exists')
  @HttpCode(HttpStatus.OK)
  public async isTagged(@Param('uuid') uuid: string, @Param('tagUuid') tagUuid: string, @UserDecorator() user: User) {
    return this.isQuoteTaggedUseCase.handle({ quoteUuid: uuid, user, tagUuid });
  }
}
