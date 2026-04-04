import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateMemberRoleRequest {
  @ApiProperty({ enum: ['EDITOR', 'VIEWER'] })
  @IsEnum(['EDITOR', 'VIEWER'])
  public role!: 'EDITOR' | 'VIEWER';
}
