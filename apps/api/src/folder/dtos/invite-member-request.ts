import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class InviteMemberByUsernameRequest {
  @ApiProperty()
  @IsString()
  public username!: string;

  @ApiProperty({ enum: ['EDITOR', 'VIEWER'] })
  @IsEnum(['EDITOR', 'VIEWER'])
  public role!: 'EDITOR' | 'VIEWER';
}
