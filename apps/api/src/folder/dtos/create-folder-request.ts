import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFolderRequest {
  @ApiProperty({ minLength: 1, maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  public name!: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  public description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(7)
  public color?: string;

  @ApiPropertyOptional({ enum: ['PUBLIC', 'PRIVATE'] })
  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE'])
  public visibility?: 'PUBLIC' | 'PRIVATE';
}
