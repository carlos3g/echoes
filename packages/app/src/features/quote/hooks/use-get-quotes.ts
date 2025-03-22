import type { ListQuotesOutput } from '@/features/quote/contracts/quote-service.contract';
import { quoteService } from '@/features/quote/services';
import type { ApiResponseError } from '@/types/api';
import type { Quote } from '@/types/entities';
import type { HttpError } from '@/types/http';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseGetQuotesProps {
  tagUuid?: string;
}

export const useGetQuotes = ({ tagUuid }: UseGetQuotesProps) => {
  const query = useInfiniteQuery<ListQuotesOutput, HttpError<ApiResponseError>>({
    queryKey: ['quotes', { tagUuid }],
    queryFn: ({ pageParam }) => quoteService.list({ paginate: { page: pageParam as number }, filters: { tagUuid } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
  });

  const { data } = query;

  const quotes: Quote[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  return { ...query, quotes };
};
