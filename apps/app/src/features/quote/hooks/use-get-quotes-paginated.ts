import type { ListQuotesOutput, QuoteFilters } from '@/features/quote/contracts/quote-service.contract';
import { quoteService } from '@/features/quote/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

type UseGetQuotesPaginatedProps = QuoteFilters & { enabled?: boolean };

export const useGetQuotesPaginated = (props: UseGetQuotesPaginatedProps) => {
  const { tagUuid, authorUuid, categoryUuid, favoritesOnly, search, enabled = true } = props;
  const [page, setPage] = useState(1);

  const query = useQuery<ListQuotesOutput, HttpError<ApiResponseError>>({
    queryKey: [...queryKeys.quotes.list({ tagUuid, authorUuid, categoryUuid, favoritesOnly, search }), 'page', page],
    queryFn: () =>
      quoteService.list({
        paginate: { page },
        filters: { tagUuid, authorUuid, categoryUuid, favoritesOnly, search },
      }),
    enabled,
    placeholderData: keepPreviousData,
  });

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    ...query,
    quotes: query.data?.data ?? [],
    currentPage: query.data?.meta.currentPage ?? page,
    lastPage: query.data?.meta.lastPage ?? 1,
    page,
    onPageChange,
  };
};
