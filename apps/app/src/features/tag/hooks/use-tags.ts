import type { ListTagsOutput } from '@/features/tag/contracts/tag-service.contract';
import { tagService } from '@/features/tag/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { Tag } from '@/types/entities';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useTags = () => {
  const query = useInfiniteQuery<ListTagsOutput>({
    queryKey: queryKeys.tags.all,
    queryFn: ({ pageParam }) => tagService.list({ paginate: { page: pageParam as number } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
  });

  const { data } = query;

  const tags: Tag[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  return { ...query, tags };
};
