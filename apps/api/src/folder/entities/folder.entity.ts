import { Exclude } from 'class-transformer';

export class Folder {
  public constructor(input: Folder) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public uuid!: string;

  public name!: string;

  public description!: string | null;

  public color!: string | null;

  public visibility!: 'PUBLIC' | 'PRIVATE';

  public position!: number;

  @Exclude()
  public userId!: number;

  public owner?: {
    uuid: string;
    name: string;
    username: string;
  };

  public metadata?: {
    totalQuotes?: number;
    totalFollowers?: number;
    isFollowedByUser?: boolean;
    memberRole?: 'OWNER' | 'EDITOR' | 'VIEWER' | null;
    isSaved?: boolean;
  };

  public createdAt!: Date;

  public updatedAt!: Date;
}
