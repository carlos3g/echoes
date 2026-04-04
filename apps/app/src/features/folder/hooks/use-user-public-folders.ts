import type { UserPublicFoldersOutput } from '@/features/folder/contracts/folder-service.contract';
import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { Folder } from '@/types/entities';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useUserPublicFolders = (username: string) => {
  const query = useInfiniteQuery<UserPublicFoldersOutput>({
    queryKey: queryKeys.folders.userPublic(username),
    queryFn: ({ pageParam }) => folderService.userPublicFolders(username, { paginate: { page: pageParam as number } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
    enabled: !!username,
  });

  const { data } = query;

  const folders: Folder[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  return { ...query, folders };
};
