import type { ListQuotesOutput, QuoteFilters } from '@/features/quote/contracts/quote-service.contract';
import { quoteService } from '@/features/quote/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { Quote } from '@/types/entities';
import type { HttpError } from '@/types/http';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type UseGetQuotesProps = QuoteFilters & { enabled?: boolean };

export const useGetQuotes = ({
  tagUuid,
  authorUuid,
  categoryUuid,
  favoritesOnly,
  search,
  enabled = true,
}: UseGetQuotesProps) => {
  const query = useInfiniteQuery<ListQuotesOutput, HttpError<ApiResponseError>>({
    queryKey: queryKeys.quotes.list({ tagUuid, authorUuid, categoryUuid, favoritesOnly, search }),
    enabled,
    queryFn: ({ pageParam }) => {
      return quoteService.list({
        paginate: { page: pageParam as number },
        filters: { tagUuid, authorUuid, categoryUuid, favoritesOnly, search },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
  });

  const { data } = query;

  const quotes: Quote[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  return { ...query, quotes };
};
