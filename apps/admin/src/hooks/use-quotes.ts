import { usePaginatedQuery } from '@/hooks/use-paginated-query';
import type { Quote } from '@/types';

interface UseQuotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export function useQuotes(params: UseQuotesParams = {}) {
  return usePaginatedQuery<Quote>('quotes', '/v1/quotes', params);
}
