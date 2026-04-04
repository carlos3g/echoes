import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  FolderFollowRepositoryCreateInput,
  FolderFollowRepositoryDeleteInput,
  FolderFollowRepositoryDeleteManyInput,
  FolderFollowRepositoryExistsInput,
  FolderFollowRepositoryFindManyPaginatedInput,
} from '@app/folder/dtos/folder-follow-repository-dtos';

export interface FolderFollower {
  userId: number;
  createdAt: Date;
}

abstract class FolderFollowRepositoryContract {
  public abstract create(input: FolderFollowRepositoryCreateInput): Promise<void>;

  public abstract delete(input: FolderFollowRepositoryDeleteInput): Promise<void>;

  public abstract deleteMany(input: FolderFollowRepositoryDeleteManyInput): Promise<void>;

  public abstract exists(input: FolderFollowRepositoryExistsInput): Promise<boolean>;

  public abstract findManyPaginated(
    input: FolderFollowRepositoryFindManyPaginatedInput
  ): Promise<PaginatedResult<FolderFollower>>;
}

export { FolderFollowRepositoryContract };
