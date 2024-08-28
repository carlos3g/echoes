import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  QuoteRepositoryCreateInput,
  QuoteRepositoryDeleteInput,
  QuoteRepositoryFindManyByTagInput,
  QuoteRepositoryFindManyFavoritedByUserInput,
  QuoteRepositoryFindManyInput,
  QuoteRepositoryFindManyPaginatedInput,
  QuoteRepositoryFindUniqueOrThrowInput,
  QuoteRepositoryUpdateInput,
} from '@app/quote/dtos/quote-repository-dtos';
import type { Quote } from '@app/quote/entities/quote.entity';

abstract class QuoteRepositoryContract {
  public abstract create(input: QuoteRepositoryCreateInput): Promise<Quote>;

  public abstract update(input: QuoteRepositoryUpdateInput): Promise<Quote>;

  public abstract findUniqueOrThrow(input: QuoteRepositoryFindUniqueOrThrowInput): Promise<Quote>;

  public abstract findManyPaginated(input: QuoteRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Quote>>;

  public abstract findManyFavoritedByUser(input?: QuoteRepositoryFindManyFavoritedByUserInput): Promise<Quote[]>;

  public abstract findManyByTag(input?: QuoteRepositoryFindManyByTagInput): Promise<Quote[]>;

  public abstract findMany(input?: QuoteRepositoryFindManyInput): Promise<Quote[]>;

  public abstract delete(input: QuoteRepositoryDeleteInput): Promise<void>;
}

export { QuoteRepositoryContract };
