export class Quote {
  public uuid!: string;

  public body!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public author?: Author;

  public metadata!: {
    favorites: number;
    tags: number;
    shares: number;
    favoritedByUser: boolean;
  };
}

export class Author {
  public uuid!: string;

  public name!: string;

  public birthDate!: Date;

  public deathDate!: Date | null;

  public bio!: string;

  public nationality!: string | null;

  public wikipediaUrl!: string | null;

  public metadata!: {
    totalQuotes: number;
    totalFavorites: number;
    favoritedByUser: boolean;
  };

  public createdAt!: Date;

  public updatedAt!: Date;
}

export class User {
  public uuid!: string;

  public name!: string;

  public email!: string;

  public username!: string;

  public password!: string;

  public emailVerifiedAt!: Date | null;

  public createdAt!: Date;

  public updatedAt!: Date;
}

export class Category {
  public uuid!: string;

  public title!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}

export class Tag {
  public uuid!: string;

  public title!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public metadata!: {
    totalQuotes: number;
  };
}
