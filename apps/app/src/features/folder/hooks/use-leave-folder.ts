import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface UseLeaveFolderProps {
  onSuccess?: () => void;
}

export const useLeaveFolder = ({ onSuccess }: UseLeaveFolderProps = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: async (folderUuid) => folderService.leaveFolder(folderUuid),
    onSuccess: () => {
      toast.success(t('folder.leaveSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.all, exact: true });
      onSuccess?.();
    },
    onError: () => {
      toast.error(t('folder.leaveErrorTitle'));
    },
  });
};
