import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CompareMonthsQuery {
  @ApiProperty({ example: '2026-03' })
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'monthA must be in YYYY-MM format' })
  public monthA!: string;

  @ApiProperty({ example: '2026-04' })
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'monthB must be in YYYY-MM format' })
  public monthB!: string;
}
