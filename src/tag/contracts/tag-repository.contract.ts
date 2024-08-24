import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  TagRepositoryCreateInput,
  TagRepositoryDeleteInput,
  TagRepositoryFindManyInput,
  TagRepositoryFindManyPaginatedInput,
  TagRepositoryFindUniqueOrThrowInput,
  TagRepositoryUpdateInput,
} from '@app/tag/dtos/tag-repository-dtos';
import type { Tag } from '@app/tag/entities/tag.entity';

abstract class TagRepositoryContract {
  public abstract create(input: TagRepositoryCreateInput): Promise<Tag>;

  public abstract update(input: TagRepositoryUpdateInput): Promise<Tag>;

  public abstract findUniqueOrThrow(input: TagRepositoryFindUniqueOrThrowInput): Promise<Tag>;

  public abstract findManyPaginated(input: TagRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Tag>>;

  public abstract findMany(input?: TagRepositoryFindManyInput): Promise<Tag[]>;

  public abstract delete(input: TagRepositoryDeleteInput): Promise<void>;
}

export { TagRepositoryContract };
