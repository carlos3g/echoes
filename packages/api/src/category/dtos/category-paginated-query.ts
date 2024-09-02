import { FilterCategoryQuery } from '@app/category/dtos/filter-category-query';
import { Paginate } from '@app/shared/dtos/paginate';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class CategoryPaginatedQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => FilterCategoryQuery)
  @ValidateNested()
  public filters?: FilterCategoryQuery;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Paginate)
  @ValidateNested()
  public paginate?: Paginate;
}
