import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from '@/lib/react-query/query-keys';
import { userService } from '@/features/user/services';
import type { SuggestedUsersOutput } from '@/features/user/contracts/user-service.contract';
import type { User } from '@/types/entities';

export const useSuggestedUsers = () => {
  const query = useInfiniteQuery<SuggestedUsersOutput>({
    queryKey: queryKeys.users.suggested,
    queryFn: ({ pageParam }) => userService.suggested({ paginate: { page: pageParam as number } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
  });

  const users: User[] = useMemo(() => query.data?.pages.map((page) => page.data).flat() ?? [], [query.data]);

  return { ...query, users };
};
