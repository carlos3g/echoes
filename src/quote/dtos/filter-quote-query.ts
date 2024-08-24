import { IsOptional, IsUUID } from 'class-validator';

export class FilterQuoteQuery {
  @IsOptional()
  @IsUUID()
  public authorUuid?: string;
}
