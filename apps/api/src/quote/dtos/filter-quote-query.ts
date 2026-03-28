import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterQuoteQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  public authorUuid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  public tagUuid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  public categoryUuid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  public favoritesOnly?: boolean;
}
