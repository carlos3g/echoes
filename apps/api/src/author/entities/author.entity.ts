import { Exclude } from 'class-transformer';

export class Author {
  public constructor(input: Author) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public uuid!: string;

  public name!: string;

  public birthDate!: Date;

  public deathDate!: Date | null;

  public bio!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}
