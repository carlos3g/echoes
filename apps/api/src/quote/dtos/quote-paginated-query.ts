import { FilterQuoteQuery } from '@app/quote/dtos/filter-quote-query';
import { Paginate } from '@app/shared/dtos/paginate';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class QuotePaginatedQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => FilterQuoteQuery)
  @ValidateNested()
  public filters?: FilterQuoteQuery;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Paginate)
  @ValidateNested()
  public paginate?: Paginate;
}
