import { Exclude } from 'class-transformer';

export class Quote {
  public constructor(input: Quote) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public uuid!: string;

  public body!: string;

  @Exclude()
  public authorId!: number | null;

  public createdAt!: Date;

  public updatedAt!: Date;
}
