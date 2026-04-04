import type {
  AddQuoteToFolderPayload,
  CreateFolderOutput,
  CreateFolderPayload,
  CreateInviteLinkOutput,
  CreateInviteLinkPayload,
  FeedOutput,
  FeedPayload,
  FolderServiceContract,
  GetFolderOutput,
  InviteByUsernamePayload,
  ListFolderQuotesOutput,
  ListFolderQuotesPayload,
  ListFoldersOutput,
  ListFoldersPayload,
  ListMembersOutput,
  PopularFoldersOutput,
  PopularFoldersPayload,
  ReorderFolderQuotesPayload,
  ReorderFoldersPayload,
  SearchFoldersOutput,
  SearchFoldersPayload,
  ToggleFolderVisibilityOutput,
  ToggleFolderVisibilityPayload,
  UpdateFolderOutput,
  UpdateFolderPayload,
  UpdateMemberRolePayload,
  UserPublicFoldersOutput,
  UserPublicFoldersPayload,
} from '@/features/folder/contracts/folder-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class FolderService implements FolderServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public list(payload: ListFoldersPayload): Promise<ListFoldersOutput> {
    return this.httpClientService.get<ListFoldersOutput, ListFoldersPayload>('/folders', payload);
  }

  public get(uuid: string): Promise<GetFolderOutput> {
    return this.httpClientService.get<GetFolderOutput, void>(`/folders/${uuid}`);
  }

  public create(payload: CreateFolderPayload): Promise<CreateFolderOutput> {
    return this.httpClientService.post<CreateFolderOutput, CreateFolderPayload>('/folders', payload);
  }

  public update(uuid: string, payload: UpdateFolderPayload): Promise<UpdateFolderOutput> {
    return this.httpClientService.patch<UpdateFolderOutput, UpdateFolderPayload>(`/folders/${uuid}`, payload);
  }

  public delete(uuid: string): Promise<void> {
    return this.httpClientService.delete<void, void>(`/folders/${uuid}`);
  }

  public listQuotes(uuid: string, payload: ListFolderQuotesPayload): Promise<ListFolderQuotesOutput> {
    return this.httpClientService.get<ListFolderQuotesOutput, ListFolderQuotesPayload>(
      `/folders/${uuid}/quotes`,
      payload
    );
  }

  public addQuote(uuid: string, payload: AddQuoteToFolderPayload): Promise<void> {
    return this.httpClientService.post<void, AddQuoteToFolderPayload>(`/folders/${uuid}/quotes`, payload);
  }

  public removeQuote(folderUuid: string, quoteUuid: string): Promise<void> {
    return this.httpClientService.delete<void, void>(`/folders/${folderUuid}/quotes/${quoteUuid}`);
  }

  public reorderQuotes(uuid: string, payload: ReorderFolderQuotesPayload): Promise<void> {
    return this.httpClientService.patch<void, ReorderFolderQuotesPayload>(`/folders/${uuid}/quotes/reorder`, payload);
  }

  public reorderFolders(payload: ReorderFoldersPayload): Promise<void> {
    return this.httpClientService.patch<void, ReorderFoldersPayload>('/folders/reorder', payload);
  }

  public toggleVisibility(uuid: string, payload: ToggleFolderVisibilityPayload): Promise<ToggleFolderVisibilityOutput> {
    return this.httpClientService.patch<ToggleFolderVisibilityOutput, ToggleFolderVisibilityPayload>(
      `/folders/${uuid}/visibility`,
      payload
    );
  }

  public follow(uuid: string): Promise<void> {
    return this.httpClientService.post<void, void>(`/folders/${uuid}/follow`);
  }

  public unfollow(uuid: string): Promise<void> {
    return this.httpClientService.post<void, void>(`/folders/${uuid}/unfollow`);
  }

  public search(payload: SearchFoldersPayload): Promise<SearchFoldersOutput> {
    return this.httpClientService.get<SearchFoldersOutput, SearchFoldersPayload>('/folders/search', payload);
  }

  public popular(payload: PopularFoldersPayload): Promise<PopularFoldersOutput> {
    return this.httpClientService.get<PopularFoldersOutput, PopularFoldersPayload>('/folders/popular', payload);
  }

  public userPublicFolders(username: string, payload: UserPublicFoldersPayload): Promise<UserPublicFoldersOutput> {
    return this.httpClientService.get<UserPublicFoldersOutput, UserPublicFoldersPayload>(
      `/folders/user/${username}`,
      payload
    );
  }

  public getFeed(payload: FeedPayload): Promise<FeedOutput> {
    return this.httpClientService.get<FeedOutput, FeedPayload>('/activity/feed', payload);
  }

  public listMembers(folderUuid: string): Promise<ListMembersOutput> {
    return this.httpClientService.get<ListMembersOutput, void>(`/folders/${folderUuid}/members`);
  }

  public inviteByUsername(folderUuid: string, payload: InviteByUsernamePayload): Promise<void> {
    return this.httpClientService.post<void, InviteByUsernamePayload>(`/folders/${folderUuid}/invite`, payload);
  }

  public createInviteLink(folderUuid: string, payload: CreateInviteLinkPayload): Promise<CreateInviteLinkOutput> {
    return this.httpClientService.post<CreateInviteLinkOutput, CreateInviteLinkPayload>(
      `/folders/${folderUuid}/invite-links`,
      payload
    );
  }

  public acceptInvite(linkUuid: string): Promise<void> {
    return this.httpClientService.post<void, void>(`/folders/accept-invite/${linkUuid}`);
  }

  public updateMemberRole(folderUuid: string, userUuid: string, payload: UpdateMemberRolePayload): Promise<void> {
    return this.httpClientService.patch<void, UpdateMemberRolePayload>(
      `/folders/${folderUuid}/members/${userUuid}/role`,
      payload
    );
  }

  public removeMember(folderUuid: string, userUuid: string): Promise<void> {
    return this.httpClientService.delete<void, void>(`/folders/${folderUuid}/members/${userUuid}`);
  }

  public leaveFolder(folderUuid: string): Promise<void> {
    return this.httpClientService.post<void, void>(`/folders/${folderUuid}/leave`);
  }
}
