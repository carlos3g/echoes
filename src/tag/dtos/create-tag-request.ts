import { IsString } from 'class-validator';

export class CreateTagRequest {
  @IsString()
  public title!: string;
}
