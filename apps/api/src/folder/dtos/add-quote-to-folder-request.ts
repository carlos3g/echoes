import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AddQuoteToFolderRequest {
  @ApiProperty()
  @IsString()
  @IsUUID()
  public quoteUuid!: string;
}
