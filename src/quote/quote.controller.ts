import { Public } from '@app/auth/decorators/public.decorator';
import { QuotePaginatedQuery } from '@app/quote/dtos/quote-paginated-query';
import { GetOneQuoteUseCase } from '@app/quote/use-cases/get-one-quote.use-case';
import { ListQuotePaginatedUseCase } from '@app/quote/use-cases/list-quote-paginated.use-case';
import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';

@Controller('quotes')
export class QuoteController {
  public constructor(
    private readonly listQuotePaginatedUseCase: ListQuotePaginatedUseCase,
    private readonly getOneQuoteUseCase: GetOneQuoteUseCase
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

  // @ApiBearerAuth()
  // @Post(':uuid/favorite')
  // @HttpCode(HttpStatus.OK)
  // public async favorite(@Param('uuid') uuid: string) {
  //   //
  // }
}
