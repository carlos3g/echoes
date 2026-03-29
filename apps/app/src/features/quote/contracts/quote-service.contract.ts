import type { ApiPaginatedResult, Paginate } from '@/types/api';
import type { Quote } from '@/types/entities';

export type GetQuotePayload = unknown;

export type GetQuoteOutput = Quote;

export interface QuoteFilters {
  tagUuid?: string;
  authorUuid?: string;
  categoryUuid?: string;
  favoritesOnly?: boolean;
  search?: string;
}

export type ListQuotesPayload = {
  paginate?: Paginate;
  filters?: QuoteFilters;
};

export type ListQuotesOutput = ApiPaginatedResult<Quote>;

export type IsQuoteTaggedOutput = {
  exists: boolean;
};

export type ShareQuotePayload = {
  type: 'image' | 'link';
  template?: string;
  platform?: string;
};

export abstract class QuoteServiceContract {
  public abstract get(uuid: string): Promise<GetQuoteOutput>;

  public abstract list(payload: ListQuotesPayload): Promise<ListQuotesOutput>;

  public abstract favorite(uuid: string): Promise<void>;

  public abstract unfavorite(uuid: string): Promise<void>;

  public abstract tag(uuid: string, tagUuid: string): Promise<void>;

  public abstract untag(uuid: string, tagUuid: string): Promise<void>;

  public abstract isTagged(uuid: string, tagUuid: string): Promise<IsQuoteTaggedOutput>;

  public abstract share(uuid: string, payload: ShareQuotePayload): Promise<void>;
}
