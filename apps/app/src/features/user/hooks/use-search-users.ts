import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from '@/lib/react-query/query-keys';
import { userService } from '@/features/user/services';
import type { SearchUsersOutput } from '@/features/user/contracts/user-service.contract';
import type { User } from '@/types/entities';

export const useSearchUsers = (query: string) => {
  const infiniteQuery = useInfiniteQuery<SearchUsersOutput>({
    queryKey: queryKeys.users.search(query),
    queryFn: ({ pageParam }) => userService.search({ q: query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
    enabled: query.length >= 2,
  });

  const users: User[] = useMemo(
    () => infiniteQuery.data?.pages.map((page) => page.data).flat() ?? [],
    [infiniteQuery.data]
  );

  return { ...infiniteQuery, users };
};
