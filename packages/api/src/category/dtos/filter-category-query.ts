import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterCategoryQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public title?: string;
}
