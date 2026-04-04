import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useFolderMembers = (folderUuid: string) => {
  return useQuery({
    queryKey: queryKeys.folders.members(folderUuid),
    queryFn: () => folderService.listMembers(folderUuid),
    enabled: !!folderUuid,
  });
};
