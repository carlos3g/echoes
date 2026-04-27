import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class ReorderFolderQuotesRequest {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  public orderedQuoteUuids!: string[];
}
