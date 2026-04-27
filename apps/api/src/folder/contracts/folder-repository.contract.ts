import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  FolderRepositoryCountFollowersBatchInput,
  FolderRepositoryCountFollowersInput,
  FolderRepositoryCountQuotesBatchInput,
  FolderRepositoryCountQuotesInput,
  FolderRepositoryCreateInput,
  FolderRepositoryDeleteInput,
  FolderRepositoryFindManyPaginatedInput,
  FolderRepositoryFindUniqueOrThrowInput,
  FolderRepositoryPopularPaginatedInput,
  FolderRepositorySearchPaginatedInput,
  FolderRepositoryUpdateInput,
  FolderRepositoryUserPublicPaginatedInput,
} from '@app/folder/dtos/folder-repository-dtos';
import type { Folder } from '@app/folder/entities/folder.entity';

abstract class FolderRepositoryContract {
  public abstract create(input: FolderRepositoryCreateInput): Promise<Folder>;

  public abstract update(input: FolderRepositoryUpdateInput): Promise<Folder>;

  public abstract findUniqueOrThrow(input: FolderRepositoryFindUniqueOrThrowInput): Promise<Folder>;

  public abstract findManyPaginated(input: FolderRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Folder>>;

  public abstract countQuotes(input: FolderRepositoryCountQuotesInput): Promise<number>;

  public abstract countFollowers(input: FolderRepositoryCountFollowersInput): Promise<number>;

  public abstract countQuotesBatch(input: FolderRepositoryCountQuotesBatchInput): Promise<Map<number, number>>;

  public abstract countFollowersBatch(input: FolderRepositoryCountFollowersBatchInput): Promise<Map<number, number>>;

  public abstract findManyByUuids(uuids: string[]): Promise<Folder[]>;

  public abstract delete(input: FolderRepositoryDeleteInput): Promise<void>;

  public abstract searchPaginated(input: FolderRepositorySearchPaginatedInput): Promise<PaginatedResult<Folder>>;

  public abstract popularPaginated(input: FolderRepositoryPopularPaginatedInput): Promise<PaginatedResult<Folder>>;

  public abstract userPublicPaginated(
    input: FolderRepositoryUserPublicPaginatedInput
  ): Promise<PaginatedResult<Folder>>;
}

export { FolderRepositoryContract };
