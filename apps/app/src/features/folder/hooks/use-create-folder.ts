import type { CreateFolderOutput, CreateFolderPayload } from '@/features/folder/contracts/folder-service.contract';
import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface UseCreateFolderProps {
  onSuccess?: (response: CreateFolderOutput) => void;
}

export const useCreateFolder = ({ onSuccess }: UseCreateFolderProps = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<CreateFolderOutput, HttpError<ApiResponseError<CreateFolderPayload>>, CreateFolderPayload>({
    mutationFn: async (payload) => folderService.create(payload),
    onSuccess: (response) => {
      toast.success(t('folder.createSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.all, exact: true });
      onSuccess?.(response);
    },
    onError: () => {
      toast.error(t('folder.createErrorTitle'), {
        description: t('folder.createErrorDescription'),
      });
    },
  });
};
