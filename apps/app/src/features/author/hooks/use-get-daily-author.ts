import { authorService } from '@/features/author/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useGetDailyAuthor = () => {
  const query = useQuery({
    queryKey: queryKeys.authors.daily,
    queryFn: () => authorService.daily(),
    staleTime: 1000 * 60 * 60,
  });

  return { author: query.data ?? null, isLoading: query.isLoading };
};
