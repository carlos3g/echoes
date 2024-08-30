import { Exclude } from 'class-transformer';

export class FileEntity {
  public constructor(input: FileEntity) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public bucket!: string;

  public key!: string;
}
