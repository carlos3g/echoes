import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import { queryKeys } from '@/lib/react-query/query-keys';
import { userService } from '@/features/user/services';
import type { HttpError } from '@/types/http';
import type { ApiResponseError } from '@/types/api';

export const useSaveFolder = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: (folderUuid: string) => userService.saveFolder(folderUuid),
    onSuccess: (_, folderUuid) => {
      toast.success(t('user.saveFolderSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.detail(folderUuid) });
    },
    onError: () => {
      toast.error(t('user.saveFolderError'));
    },
  });
};
