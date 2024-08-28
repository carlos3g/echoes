import { Public } from '@app/auth/decorators/public.decorator';
import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { QuotePaginatedQuery } from '@app/quote/dtos/quote-paginated-query';
import { TagQuoteRequest } from '@app/quote/dtos/tag-quote-request';
import { FavoriteQuoteUseCase } from '@app/quote/use-cases/favorite-quote.use-case';
import { GetOneQuoteUseCase } from '@app/quote/use-cases/get-one-quote.use-case';
import { ListQuotePaginatedUseCase } from '@app/quote/use-cases/list-quote-paginated.use-case';
import { TagQuoteUseCase } from '@app/quote/use-cases/tag-quote.use-case';
import { User } from '@app/user/entities/user.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('quotes')
export class QuoteController {
  public constructor(
    private readonly listQuotePaginatedUseCase: ListQuotePaginatedUseCase,
    private readonly getOneQuoteUseCase: GetOneQuoteUseCase,
    private readonly favoriteQuoteUseCase: FavoriteQuoteUseCase,
    private readonly tagQuoteUseCase: TagQuoteUseCase
  ) {}

  @Public()
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: QuotePaginatedQuery) {
    return this.listQuotePaginatedUseCase.handle(params);
  }

  @Public()
  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  public async show(@Param('uuid') uuid: string) {
    return this.getOneQuoteUseCase.handle({ uuid });
  }

  @ApiBearerAuth()
  @Post(':uuid/favorite')
  @HttpCode(HttpStatus.OK)
  public async favorite(@Param('uuid') uuid: string, @UserDecorator() user: User) {
    return this.favoriteQuoteUseCase.handle({ quoteUuid: uuid, user });
  }

  @ApiBearerAuth()
  @Post(':uuid/tag')
  @HttpCode(HttpStatus.OK)
  public async tag(@Param('uuid') uuid: string, @UserDecorator() user: User, @Body() input: TagQuoteRequest) {
    return this.tagQuoteUseCase.handle({ quoteUuid: uuid, user, tagUuid: input.tagUuid });
  }
}
