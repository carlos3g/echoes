import { Exclude } from 'class-transformer';

export class Tag {
  public constructor(input: Tag) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public uuid!: string;

  public title!: string;

  @Exclude()
  public userId!: number | null;

  public createdAt!: Date;

  public updatedAt!: Date;
}
