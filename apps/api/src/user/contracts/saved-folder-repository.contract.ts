import type { PaginatedResult, PaginateOptions } from '@app/lib/prisma/helpers/pagination';
import type { Folder } from '@app/folder/entities/folder.entity';

export interface SavedFolderExistsInput {
  userId: number;
  folderId: number;
}

export interface SavedFolderCreateInput {
  userId: number;
  folderId: number;
}

export interface SavedFolderDeleteInput {
  userId: number;
  folderId: number;
}

export interface SavedFolderListInput {
  userId: number;
  options?: PaginateOptions;
}

abstract class SavedFolderRepositoryContract {
  public abstract exists(input: SavedFolderExistsInput): Promise<boolean>;
  public abstract create(input: SavedFolderCreateInput): Promise<void>;
  public abstract delete(input: SavedFolderDeleteInput): Promise<void>;
  public abstract listByUser(input: SavedFolderListInput): Promise<PaginatedResult<Folder>>;
}

export { SavedFolderRepositoryContract };
