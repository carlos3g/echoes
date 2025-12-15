import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type { Quote } from '@/types/entities';
import type { ApiPaginatedResult } from '@/types/api';

type PreviousState = [QueryKey, InfiniteData<ApiPaginatedResult<Quote>>];

interface UpdateQuotesCacheStateResult {
  state: InfiniteData<ApiPaginatedResult<Quote>>;
  previousState: PreviousState;
  queryKey: QueryKey;
}

export const updateQuotesCacheState = (
  queryClient: QueryClient,
  updateFn: (quote: Quote) => Quote
): UpdateQuotesCacheStateResult | null => {
  // TODO: get previousState using queryClient.getQueryData. Needs to get quotes filters first
  const queriesData = queryClient.getQueriesData<InfiniteData<ApiPaginatedResult<Quote>>>({
    queryKey: ['quotes'],
  });

  const previousState = queriesData.find((qData) => {
    const [__, queryData] = qData;

    return !!queryData?.pageParams;
  });

  const [previousStateQuery, previousStateData] = previousState || [];

  if (!previousStateData || !previousStateQuery) {
    return null;
  }

  const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
    pageParams: previousStateData?.pageParams,
    pages: previousStateData?.pages?.map((page) => {
      const quotes = page.data.map(updateFn);

      return {
        ...page,
        data: quotes,
      };
    }),
  };

  return {
    state: newState,
    previousState: previousState as PreviousState,
    queryKey: previousStateQuery,
  };
};
