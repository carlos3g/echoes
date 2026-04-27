import type { ApiPaginatedResult, Paginate } from '@/types/api';
import type { FeedEvent, Folder, FolderMember, Quote } from '@/types/entities';

export type CreateFolderPayload = {
  name: string;
  description?: string;
  color?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
};

export type CreateFolderOutput = Folder;

export type UpdateFolderPayload = {
  name?: string;
  description?: string | null;
  color?: string | null;
};

export type UpdateFolderOutput = Folder;

export type ListFoldersPayload = {
  paginate?: Paginate;
};

export type ListFoldersOutput = ApiPaginatedResult<Folder>;

export type GetFolderOutput = Folder;

export type ListFolderQuotesPayload = {
  paginate?: Paginate;
};

export type ListFolderQuotesOutput = ApiPaginatedResult<Quote>;

export type AddQuoteToFolderPayload = {
  quoteUuid: string;
};

export type ReorderFolderQuotesPayload = {
  orderedQuoteUuids: string[];
};

export type ReorderFoldersPayload = {
  orderedUuids: string[];
};

export type ToggleFolderVisibilityPayload = {
  visibility: 'PUBLIC' | 'PRIVATE';
};

export type ToggleFolderVisibilityOutput = Folder;

export type SearchFoldersPayload = {
  q: string;
  paginate?: Paginate;
};

export type SearchFoldersOutput = ApiPaginatedResult<Folder>;

export type PopularFoldersPayload = {
  paginate?: Paginate;
};

export type PopularFoldersOutput = ApiPaginatedResult<Folder>;

export type UserPublicFoldersPayload = {
  paginate?: Paginate;
};

export type UserPublicFoldersOutput = ApiPaginatedResult<Folder>;

export type FeedPayload = {
  paginate?: Paginate;
};

export type FeedOutput = ApiPaginatedResult<FeedEvent>;

export type ListMembersOutput = FolderMember[];

export type InviteByUsernamePayload = {
  username: string;
  role: 'EDITOR' | 'VIEWER';
};

export type CreateInviteLinkPayload = {
  role: 'EDITOR' | 'VIEWER';
};

export type CreateInviteLinkOutput = {
  uuid: string;
  role: string;
};

export type UpdateMemberRolePayload = {
  role: 'EDITOR' | 'VIEWER';
};

export abstract class FolderServiceContract {
  public abstract list(payload: ListFoldersPayload): Promise<ListFoldersOutput>;

  public abstract get(uuid: string): Promise<GetFolderOutput>;

  public abstract create(payload: CreateFolderPayload): Promise<CreateFolderOutput>;

  public abstract update(uuid: string, payload: UpdateFolderPayload): Promise<UpdateFolderOutput>;

  public abstract delete(uuid: string): Promise<void>;

  public abstract listQuotes(uuid: string, payload: ListFolderQuotesPayload): Promise<ListFolderQuotesOutput>;

  public abstract addQuote(uuid: string, payload: AddQuoteToFolderPayload): Promise<void>;

  public abstract removeQuote(folderUuid: string, quoteUuid: string): Promise<void>;

  public abstract reorderQuotes(uuid: string, payload: ReorderFolderQuotesPayload): Promise<void>;

  public abstract reorderFolders(payload: ReorderFoldersPayload): Promise<void>;

  public abstract toggleVisibility(
    uuid: string,
    payload: ToggleFolderVisibilityPayload
  ): Promise<ToggleFolderVisibilityOutput>;

  public abstract follow(uuid: string): Promise<void>;

  public abstract unfollow(uuid: string): Promise<void>;

  public abstract search(payload: SearchFoldersPayload): Promise<SearchFoldersOutput>;

  public abstract popular(payload: PopularFoldersPayload): Promise<PopularFoldersOutput>;

  public abstract userPublicFolders(
    username: string,
    payload: UserPublicFoldersPayload
  ): Promise<UserPublicFoldersOutput>;

  public abstract getFeed(payload: FeedPayload): Promise<FeedOutput>;

  public abstract listMembers(folderUuid: string): Promise<ListMembersOutput>;

  public abstract inviteByUsername(folderUuid: string, payload: InviteByUsernamePayload): Promise<void>;

  public abstract createInviteLink(
    folderUuid: string,
    payload: CreateInviteLinkPayload
  ): Promise<CreateInviteLinkOutput>;

  public abstract acceptInvite(linkUuid: string): Promise<void>;

  public abstract updateMemberRole(
    folderUuid: string,
    userUuid: string,
    payload: UpdateMemberRolePayload
  ): Promise<void>;

  public abstract removeMember(folderUuid: string, userUuid: string): Promise<void>;

  public abstract leaveFolder(folderUuid: string): Promise<void>;
}
