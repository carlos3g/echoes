import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ToggleFolderVisibilityRequest {
  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE'] })
  @IsEnum(['PUBLIC', 'PRIVATE'])
  public visibility!: 'PUBLIC' | 'PRIVATE';
}
