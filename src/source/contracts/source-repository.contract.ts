import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  SourceRepositoryCreateInput,
  SourceRepositoryFindManyInput,
  SourceRepositoryFindManyPaginatedInput,
  SourceRepositoryFindUniqueOrThrowInput,
  SourceRepositoryUpdateInput,
} from '@app/source/dtos/source-repository-dtos';
import type { Source } from '@app/source/entities/source.entity';

abstract class SourceRepositoryContract {
  public abstract create(input: SourceRepositoryCreateInput): Promise<Source>;

  public abstract update(input: SourceRepositoryUpdateInput): Promise<Source>;

  public abstract findUniqueOrThrow(input: SourceRepositoryFindUniqueOrThrowInput): Promise<Source>;

  public abstract findManyPaginated(input: SourceRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Source>>;

  public abstract findMany(input?: SourceRepositoryFindManyInput): Promise<Source[]>;
}

export { SourceRepositoryContract };
