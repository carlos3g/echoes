import type { QuoteFilters } from '@/features/quote/contracts/quote-service.contract';
import { useReadingPreferencesStore } from '@/lib/zustand/stores/reading-preferences.store';
import { useGetQuotes } from './use-get-quotes';
import { useGetQuotesPaginated } from './use-get-quotes-paginated';

export function useQuoteList(props: QuoteFilters) {
  const listMode = useReadingPreferencesStore((s) => s.listMode);
  const isPaginated = listMode === 'paginated';

  const infinite = useGetQuotes({ ...props, enabled: !isPaginated });
  const paginated = useGetQuotesPaginated({ ...props, enabled: isPaginated });

  if (isPaginated) {
    return {
      quotes: paginated.quotes,
      isLoading: paginated.isLoading,
      isRefetching: paginated.isRefetching,
      refetch: paginated.refetch,
      fetchNextPage: () => {},
      currentPage: paginated.currentPage,
      lastPage: paginated.lastPage,
      onPageChange: paginated.onPageChange,
    };
  }

  return {
    quotes: infinite.quotes,
    isLoading: infinite.isLoading,
    isRefetching: infinite.isRefetching,
    refetch: infinite.refetch,
    fetchNextPage: infinite.fetchNextPage,
    currentPage: undefined,
    lastPage: undefined,
    onPageChange: undefined,
  };
}
