import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useFolderDetail = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.folders.detail(uuid),
    queryFn: () => folderService.get(uuid),
    enabled: !!uuid,
  });
};
