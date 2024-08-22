import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class Paginate {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  public page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  public perPage?: number;
}
