import { FilterAuthorQuery } from '@app/author/dtos/filter-author-query';
import { Paginate } from '@app/shared/dtos/paginate';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class AuthorPaginatedQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => FilterAuthorQuery)
  @ValidateNested()
  public filters?: FilterAuthorQuery;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Paginate)
  @ValidateNested()
  public paginate?: Paginate;
}
