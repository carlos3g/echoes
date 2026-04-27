import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

export const useUnfollowFolder = (folderUuid: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, void>({
    mutationFn: () => folderService.unfollow(folderUuid),
    onSuccess: () => {
      toast.success(t('folder.unfollowSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.detail(folderUuid) });
    },
    onError: () => {
      toast.error(t('folder.unfollowError'));
    },
  });
};
