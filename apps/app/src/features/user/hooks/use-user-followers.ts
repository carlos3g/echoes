import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from '@/lib/react-query/query-keys';
import { userService } from '@/features/user/services';
import type { ListFollowersOutput } from '@/features/user/contracts/user-service.contract';
import type { User } from '@/types/entities';

export const useUserFollowers = (username: string) => {
  const query = useInfiniteQuery<ListFollowersOutput>({
    queryKey: queryKeys.users.followers(username),
    queryFn: ({ pageParam }) => userService.listFollowers(username, { paginate: { page: pageParam as number } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
    enabled: !!username,
  });

  const users: User[] = useMemo(() => query.data?.pages.map((page) => page.data).flat() ?? [], [query.data]);

  return { ...query, users };
};
