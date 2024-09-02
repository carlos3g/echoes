import { Exclude } from 'class-transformer';

export class Source {
  public constructor(input: Source) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public uuid!: string;

  public title!: string;

  @Exclude()
  public quoteId!: number;

  public createdAt!: Date;

  public updatedAt!: Date;
}
