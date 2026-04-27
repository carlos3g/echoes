import type { FeedOutput } from '@/features/folder/contracts/folder-service.contract';
import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { FeedEvent } from '@/types/entities';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useFeed = () => {
  const query = useInfiniteQuery<FeedOutput>({
    queryKey: queryKeys.feed.all,
    queryFn: ({ pageParam }) => folderService.getFeed({ paginate: { page: pageParam as number } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
  });

  const { data } = query;

  const events: FeedEvent[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  return { ...query, events };
};
