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

  public metadata?: {
    totalQuotes?: number;
    totalFollowers?: number;
    isFollowedByUser?: boolean;
    memberRole?: 'OWNER' | 'EDITOR' | 'VIEWER' | null;
  };

  public createdAt!: Date;

  public updatedAt!: Date;
}
