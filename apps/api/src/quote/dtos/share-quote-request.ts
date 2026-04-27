import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ShareQuoteRequest {
  @IsIn(['image', 'link'])
  public type!: string;

  @IsOptional()
  @IsIn(['classic', 'dark', 'minimal', 'nature'])
  public template?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  public platform?: string;
}
