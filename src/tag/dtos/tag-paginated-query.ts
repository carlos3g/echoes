import { Paginate } from '@app/shared/dtos/paginate';
import { FilterTagQuery } from '@app/tag/dtos/filter-tag-query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class TagPaginatedQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => FilterTagQuery)
  @ValidateNested()
  public filters?: FilterTagQuery;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Paginate)
  @ValidateNested()
  public paginate?: Paginate;
}
