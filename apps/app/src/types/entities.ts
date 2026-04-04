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

  public bio!: string | null;

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

export class Folder {
  public uuid!: string;

  public name!: string;

  public description!: string | null;

  public color!: string | null;

  public visibility!: 'PUBLIC' | 'PRIVATE';

  public position!: number;

  public owner?: {
    uuid: string;
    name: string;
    username: string;
  };

  public metadata!: {
    totalQuotes: number;
    totalFollowers: number;
    isFollowedByUser?: boolean;
    memberRole?: string | null;
    isSaved?: boolean;
  };

  public createdAt!: Date;

  public updatedAt!: Date;
}

export class UserProfile {
  public uuid!: string;

  public name!: string;

  public username!: string;

  public bio!: string | null;

  public followersCount!: number;

  public followingCount!: number;

  public isFollowedByUser?: boolean;

  public createdAt!: Date;
}

export class FolderMember {
  public role!: 'OWNER' | 'EDITOR' | 'VIEWER';

  public user!: {
    uuid: string;
    name: string;
    username: string;
  };

  public createdAt!: Date;
}

export class FeedEvent {
  public type!: string;

  public actor!: {
    uuid: string;
    name: string;
    username: string;
  };

  public folder?: {
    uuid: string;
    name: string;
  };

  public quote?: {
    uuid: string;
    body: string;
  };

  public createdAt!: Date;
}
