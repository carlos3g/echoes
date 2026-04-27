import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterQuoteQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  public authorUuid?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }: { value: unknown }) => (Array.isArray(value) ? (value as string[]) : [value as string]))
  public tagUuids?: string[];

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
