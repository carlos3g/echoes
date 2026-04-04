import type { ListFolderQuotesOutput } from '@/features/folder/contracts/folder-service.contract';
import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { Quote } from '@/types/entities';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useFolderQuotes = (folderUuid: string) => {
  const query = useInfiniteQuery<ListFolderQuotesOutput>({
    queryKey: queryKeys.folders.quotes(folderUuid),
    queryFn: ({ pageParam }) => folderService.listQuotes(folderUuid, { paginate: { page: pageParam as number } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
    enabled: !!folderUuid,
  });

  const { data } = query;

  const quotes: Quote[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  return { ...query, quotes };
};
