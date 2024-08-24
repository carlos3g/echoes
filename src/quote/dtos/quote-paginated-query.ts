import { FilterQuoteQuery } from '@app/quote/dtos/filter-quote-query';
import { Paginate } from '@app/shared/dtos/paginate';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class QuotePaginatedQuery {
  @IsOptional()
  @Type(() => FilterQuoteQuery)
  @ValidateNested()
  public filters?: FilterQuoteQuery;

  @IsOptional()
  @Type(() => Paginate)
  @ValidateNested()
  public paginate?: Paginate;
}
