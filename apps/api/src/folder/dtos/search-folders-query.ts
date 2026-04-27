import { Paginate } from '@app/shared/dtos/paginate';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

export class SearchFoldersQuery {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public q!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Paginate)
  @ValidateNested()
  public paginate?: Paginate;
}
