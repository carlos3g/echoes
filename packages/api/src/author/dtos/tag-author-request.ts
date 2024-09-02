import { IsUUID } from 'class-validator';

export class TagAuthorRequest {
  @IsUUID()
  public tagUuid!: string;
}
