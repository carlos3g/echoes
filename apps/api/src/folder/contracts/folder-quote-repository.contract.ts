import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  FolderQuoteRepositoryCreateInput,
  FolderQuoteRepositoryDeleteInput,
  FolderQuoteRepositoryFindInput,
  FolderQuoteRepositoryFindManyPaginatedInput,
  FolderQuoteRepositoryUpdatePositionsInput,
} from '@app/folder/dtos/folder-quote-repository-dtos';
import type { Quote } from '@app/quote/entities/quote.entity';

abstract class FolderQuoteRepositoryContract {
  public abstract create(input: FolderQuoteRepositoryCreateInput): Promise<void>;

  public abstract delete(input: FolderQuoteRepositoryDeleteInput): Promise<void>;

  public abstract exists(input: FolderQuoteRepositoryFindInput): Promise<boolean>;

  public abstract findManyPaginated(
    input: FolderQuoteRepositoryFindManyPaginatedInput
  ): Promise<PaginatedResult<Quote>>;

  public abstract updatePositions(input: FolderQuoteRepositoryUpdatePositionsInput): Promise<void>;

  public abstract getMaxPosition(folderId: number): Promise<number>;
}

export { FolderQuoteRepositoryContract };
