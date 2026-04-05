import { Paginate } from '@app/shared/dtos/paginate';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AdminListUsersQuery extends Paginate {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public search?: string;
}
