import type { Paginate } from '@app/shared/dtos/paginate';

export interface FolderFollowRepositoryCreateInput {
  folderId: number;
  userId: number;
}

export interface FolderFollowRepositoryDeleteInput {
  where: {
    folderId: number;
    userId: number;
  };
}

export interface FolderFollowRepositoryDeleteManyInput {
  where: {
    folderId: number;
  };
}

export interface FolderFollowRepositoryExistsInput {
  where: {
    folderId: number;
    userId: number;
  };
}

export interface FolderFollowRepositoryFindManyPaginatedInput {
  where: {
    folderId: number;
  };
  options?: Paginate;
}
