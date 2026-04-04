import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class ReorderFoldersRequest {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  public orderedUuids!: string[];
}
