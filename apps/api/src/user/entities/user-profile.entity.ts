import { Exclude } from 'class-transformer';

export class UserProfile {
  public constructor(input: UserProfile) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public uuid!: string;

  public name!: string;

  public username!: string;

  public bio!: string | null;

  public followersCount!: number;

  public followingCount!: number;

  public isFollowedByUser?: boolean;

  public createdAt!: Date;
}
