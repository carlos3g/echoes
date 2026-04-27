import type { QuoteSearchResult, AuthorSearchResult, CategorySearchResult } from '@app/search/dtos/search-result.dto';

export abstract class SearchRepositoryContract {
  public abstract searchQuotes(term: string, limit: number, userId?: bigint): Promise<QuoteSearchResult[]>;
  public abstract searchAuthors(term: string, limit: number): Promise<AuthorSearchResult[]>;
  public abstract searchCategories(term: string, limit: number): Promise<CategorySearchResult[]>;
  public abstract fuzzySearchQuotes(term: string, limit: number, userId?: bigint): Promise<QuoteSearchResult[]>;
  public abstract fuzzySearchAuthors(term: string, limit: number): Promise<AuthorSearchResult[]>;
}
