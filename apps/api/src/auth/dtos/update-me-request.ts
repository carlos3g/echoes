import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMeRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  public bio?: string;
}
