import type {
  GetUserProfileOutput,
  ListFollowersOutput,
  ListFollowersPayload,
  ListFollowingOutput,
  ListFollowingPayload,
  SearchUsersOutput,
  SearchUsersPayload,
  SuggestedUsersOutput,
  SuggestedUsersPayload,
  UserServiceContract,
} from '@/features/user/contracts/user-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class UserService implements UserServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public getProfile(username: string): Promise<GetUserProfileOutput> {
    return this.httpClientService.get<GetUserProfileOutput, void>(`/users/${username}/profile`);
  }

  public follow(username: string): Promise<void> {
    return this.httpClientService.post<void, void>(`/users/${username}/follow`);
  }

  public unfollow(username: string): Promise<void> {
    return this.httpClientService.post<void, void>(`/users/${username}/unfollow`);
  }

  public listFollowers(username: string, payload?: ListFollowersPayload): Promise<ListFollowersOutput> {
    return this.httpClientService.get<ListFollowersOutput, ListFollowersPayload>(
      `/users/${username}/followers`,
      payload
    );
  }

  public listFollowing(username: string, payload?: ListFollowingPayload): Promise<ListFollowingOutput> {
    return this.httpClientService.get<ListFollowingOutput, ListFollowingPayload>(
      `/users/${username}/following`,
      payload
    );
  }

  public saveFolder(folderUuid: string): Promise<void> {
    return this.httpClientService.post<void, void>(`/users/folders/${folderUuid}/save`);
  }

  public unsaveFolder(folderUuid: string): Promise<void> {
    return this.httpClientService.post<void, void>(`/users/folders/${folderUuid}/unsave`);
  }

  public search(payload: SearchUsersPayload): Promise<SearchUsersOutput> {
    return this.httpClientService.get<SearchUsersOutput, SearchUsersPayload>('/users/search', payload);
  }

  public suggested(payload?: SuggestedUsersPayload): Promise<SuggestedUsersOutput> {
    return this.httpClientService.get<SuggestedUsersOutput, SuggestedUsersPayload>('/users/suggested', payload);
  }
}
