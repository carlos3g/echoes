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
  QuoteRepositoryIsFavoritedInput,
  QuoteRepositoryIsTaggedInput,
  QuoteRepositoryTagInput,
  QuoteRepositoryUnfavoriteInput,
  QuoteRepositoryUntagInput,
  QuoteRepositoryUpdateInput,
} from '@app/quote/dtos/quote-repository-dtos';
import type { Quote } from '@app/quote/entities/quote.entity';

abstract class QuoteRepositoryContract {
  public abstract create(input: QuoteRepositoryCreateInput): Promise<Quote>;

  public abstract update(input: QuoteRepositoryUpdateInput): Promise<Quote>;

  public abstract favorite(input: QuoteRepositoryFavoriteInput): Promise<void>;

  public abstract unfavorite(input: QuoteRepositoryUnfavoriteInput): Promise<void>;

  public abstract isFavorited(input: QuoteRepositoryIsFavoritedInput): Promise<boolean>;

  public abstract tag(input: QuoteRepositoryTagInput): Promise<void>;

  public abstract untag(input: QuoteRepositoryUntagInput): Promise<void>;

  public abstract isTagged(input: QuoteRepositoryIsTaggedInput): Promise<boolean>;

  public abstract countFavorites(quoteId: number): Promise<number>;

  public abstract countTags(quoteId: number): Promise<number>;

  public abstract findUniqueOrThrow(input: QuoteRepositoryFindUniqueOrThrowInput): Promise<Quote>;

  public abstract findManyPaginated(input: QuoteRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Quote>>;

  public abstract findManyFavoritedByUser(input: QuoteRepositoryFindManyFavoritedByUserInput): Promise<Quote[]>;

  public abstract findManyByTag(input: QuoteRepositoryFindManyByTagInput): Promise<Quote[]>;

  public abstract findMany(input?: QuoteRepositoryFindManyInput): Promise<Quote[]>;

  public abstract delete(input: QuoteRepositoryDeleteInput): Promise<void>;

  public abstract countFavoritesBatch(quoteIds: number[]): Promise<Map<number, number>>;

  public abstract countTagsBatch(quoteIds: number[]): Promise<Map<number, number>>;

  public abstract isFavoritedBatch(input: { quoteIds: number[]; userId: number }): Promise<Set<number>>;
}

export { QuoteRepositoryContract };
