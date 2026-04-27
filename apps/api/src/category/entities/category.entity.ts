import { Exclude } from 'class-transformer';

export class Category {
  public constructor(input: Category) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public uuid!: string;

  public title!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}
