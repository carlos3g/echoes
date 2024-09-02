import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenInput {
  @ApiProperty()
  @IsString()
  public refreshToken!: string;
}
