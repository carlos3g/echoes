import { Paginate } from '@app/shared/dtos/paginate';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class ListActivityPaginatedQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Paginate)
  @ValidateNested()
  public paginate?: Paginate;
}
