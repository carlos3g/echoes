export class Quote {
  public uuid!: string;

  public body!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public author?: Author;
}

export class Author {
  public uuid!: string;

  public name!: string;

  public birthDate!: Date;

  public deathDate!: Date | null;

  public bio!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}
