import type { PaginatedResult, PaginateOptions } from '@app/lib/prisma/helpers/pagination';
import type { User } from '@app/user/entities/user.entity';

export interface UserFollowExistsInput {
  followerId: number;
  followingId: number;
}

export interface UserFollowCreateInput {
  followerId: number;
  followingId: number;
}

export interface UserFollowDeleteInput {
  followerId: number;
  followingId: number;
}

export interface UserFollowCountInput {
  userId: number;
}

export interface UserFollowPaginatedInput {
  userId: number;
  options?: PaginateOptions;
}

abstract class UserFollowRepositoryContract {
  public abstract exists(input: UserFollowExistsInput): Promise<boolean>;
  public abstract create(input: UserFollowCreateInput): Promise<void>;
  public abstract delete(input: UserFollowDeleteInput): Promise<void>;
  public abstract countFollowers(input: UserFollowCountInput): Promise<number>;
  public abstract countFollowing(input: UserFollowCountInput): Promise<number>;
  public abstract listFollowers(input: UserFollowPaginatedInput): Promise<PaginatedResult<User>>;
  public abstract listFollowing(input: UserFollowPaginatedInput): Promise<PaginatedResult<User>>;
}

export { UserFollowRepositoryContract };
