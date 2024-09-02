import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FilterQuoteQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  public authorUuid?: string;
}
