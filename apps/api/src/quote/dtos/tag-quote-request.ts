import { IsUUID } from 'class-validator';

export class TagQuoteRequest {
  @IsUUID()
  public tagUuid!: string;
}
