import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsDateString, IsInt, Min, ValidateNested } from 'class-validator';

export class SessionItemDto {
  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  @IsDateString()
  public startedAt!: string;

  @ApiProperty({ example: '2026-04-03T10:15:00.000Z' })
  @IsDateString()
  public endedAt!: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  public quotesViewed!: number;
}

export class SyncSessionsBody {
  @ApiProperty({ type: [SessionItemDto] })
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => SessionItemDto)
  public sessions!: SessionItemDto[];
}
