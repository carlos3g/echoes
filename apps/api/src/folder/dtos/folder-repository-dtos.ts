import type { Paginate } from '@app/shared/dtos/paginate';
import type { AtLeastOne } from '@app/shared/types';

export interface FolderRepositoryCreateInput {
  uuid: string;
  name: string;
  description?: string | null;
  color?: string | null;
  visibility?: 'PUBLIC' | 'PRIVATE';
  position?: number;
  userId: number;
}

export interface FolderRepositoryUpdateInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
  data: Partial<{
    name: string;
    description: string | null;
    color: string | null;
    visibility: 'PUBLIC' | 'PRIVATE';
    position: number;
  }>;
}

export interface FolderRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
}

export interface FolderRepositoryFindManyPaginatedInput {
  where?: {
    userId?: number;
    visibility?: 'PUBLIC' | 'PRIVATE';
  };
  options?: Paginate;
}

export interface FolderRepositoryDeleteInput {
  where: AtLeastOne<{
    id?: number;
    uuid?: string;
  }>;
}

export interface FolderRepositoryCountQuotesInput {
  folderId: number;
}

export interface FolderRepositoryCountFollowersInput {
  folderId: number;
}

export interface FolderRepositoryCountQuotesBatchInput {
  folderIds: number[];
}

export interface FolderRepositoryCountFollowersBatchInput {
  folderIds: number[];
}

export interface FolderRepositorySearchPaginatedInput {
  query: string;
  excludeUserId?: number;
  options?: Paginate;
}

export interface FolderRepositoryPopularPaginatedInput {
  excludeUserId?: number;
  options?: Paginate;
}

export interface FolderRepositoryUserPublicPaginatedInput {
  userId: number;
  options?: Paginate;
}
