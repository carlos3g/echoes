import type { SearchFoldersOutput } from '@/features/folder/contracts/folder-service.contract';
import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { Folder } from '@/types/entities';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useSearchFolders = (query: string) => {
  const result = useInfiniteQuery<SearchFoldersOutput>({
    queryKey: queryKeys.folders.search(query),
    queryFn: ({ pageParam }) => folderService.search({ q: query, paginate: { page: pageParam as number } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
    enabled: query.length >= 2,
  });

  const { data } = result;

  const folders: Folder[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  return { ...result, folders };
};
