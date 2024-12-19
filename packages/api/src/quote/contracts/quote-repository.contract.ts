import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  QuoteRepositoryCreateInput,
  QuoteRepositoryDeleteInput,
  QuoteRepositoryFavoriteInput,
  QuoteRepositoryFindManyByTagInput,
  QuoteRepositoryFindManyFavoritedByUserInput,
  QuoteRepositoryFindManyInput,
  QuoteRepositoryFindManyPaginatedInput,
  QuoteRepositoryFindUniqueOrThrowInput,
  QuoteRepositoryTagInput,
  QuoteRepositoryUntagInput,
  QuoteRepositoryUpdateInput,
} from '@app/quote/dtos/quote-repository-dtos';
import type { Quote } from '@app/quote/entities/quote.entity';

abstract class QuoteRepositoryContract {
  public abstract create(input: QuoteRepositoryCreateInput): Promise<Quote>;

  public abstract update(input: QuoteRepositoryUpdateInput): Promise<Quote>;

  public abstract favorite(input: QuoteRepositoryFavoriteInput): Promise<void>;

  public abstract tag(input: QuoteRepositoryTagInput): Promise<void>;

  public abstract untag(input: QuoteRepositoryUntagInput): Promise<void>;

  public abstract findUniqueOrThrow(input: QuoteRepositoryFindUniqueOrThrowInput): Promise<Quote>;

  public abstract findManyPaginated(input: QuoteRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Quote>>;

  public abstract findManyFavoritedByUser(input: QuoteRepositoryFindManyFavoritedByUserInput): Promise<Quote[]>;

  public abstract findManyByTag(input: QuoteRepositoryFindManyByTagInput): Promise<Quote[]>;

  public abstract findMany(input?: QuoteRepositoryFindManyInput): Promise<Quote[]>;

  public abstract delete(input: QuoteRepositoryDeleteInput): Promise<void>;
}

export { QuoteRepositoryContract };
