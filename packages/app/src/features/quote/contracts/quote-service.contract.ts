import type { ApiPaginatedResult, Paginate } from '@/types/api';
import type { Quote } from '@/types/entities';

export type GetQuotePayload = unknown;

export type GetQuoteOutput = Quote;

export type ListQuotesPayload = {
  paginate?: Paginate;
};

export type ListQuotesOutput = ApiPaginatedResult<Quote>;

export abstract class QuoteServiceContract {
  public abstract get(uuid: string): Promise<GetQuoteOutput>;

  public abstract list(payload: ListQuotesPayload): Promise<ListQuotesOutput>;
}
