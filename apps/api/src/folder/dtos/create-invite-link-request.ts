import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class CreateInviteLinkRequest {
  @ApiProperty({ enum: ['EDITOR', 'VIEWER'] })
  @IsEnum(['EDITOR', 'VIEWER'])
  public role!: 'EDITOR' | 'VIEWER';

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  public maxUses?: number;
}
