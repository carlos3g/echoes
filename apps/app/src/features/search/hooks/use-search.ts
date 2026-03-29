import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchService } from '@/features/search/services/search.service';
import type { SearchResult } from '@/features/search/contracts';
import { queryKeys } from '@/lib/react-query/query-keys';

export function useSearch(query: string) {
  return useQuery<SearchResult>({
    queryKey: queryKeys.search.query(query),
    queryFn: () => searchService.search({ q: query }),
    enabled: query.length >= 2,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}
