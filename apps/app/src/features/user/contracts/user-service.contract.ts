import type { ApiPaginatedResult } from '@/types/api';
import type { User, UserProfile } from '@/types/entities';

export type GetUserProfileOutput = UserProfile;

export type ListFollowersOutput = ApiPaginatedResult<User>;
export interface ListFollowersPayload {
  paginate?: { page?: number };
}

export type ListFollowingOutput = ApiPaginatedResult<User>;
export interface ListFollowingPayload {
  paginate?: { page?: number };
}

export type SearchUsersOutput = ApiPaginatedResult<User>;
export interface SearchUsersPayload {
  q: string;
  page?: number;
}

export type SuggestedUsersOutput = ApiPaginatedResult<User>;
export interface SuggestedUsersPayload {
  paginate?: { page?: number };
}

export abstract class UserServiceContract {
  public abstract getProfile(username: string): Promise<GetUserProfileOutput>;
  public abstract follow(username: string): Promise<void>;
  public abstract unfollow(username: string): Promise<void>;
  public abstract listFollowers(username: string, payload?: ListFollowersPayload): Promise<ListFollowersOutput>;
  public abstract listFollowing(username: string, payload?: ListFollowingPayload): Promise<ListFollowingOutput>;
  public abstract saveFolder(folderUuid: string): Promise<void>;
  public abstract unsaveFolder(folderUuid: string): Promise<void>;
  public abstract search(payload: SearchUsersPayload): Promise<SearchUsersOutput>;
  public abstract suggested(payload?: SuggestedUsersPayload): Promise<SuggestedUsersOutput>;
}
