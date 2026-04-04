import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface RemoveMemberInput {
  folderUuid: string;
  userUuid: string;
}

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, RemoveMemberInput>({
    mutationFn: async ({ folderUuid, userUuid }) => folderService.removeMember(folderUuid, userUuid),
    onSuccess: (_, { folderUuid }) => {
      toast.success(t('folder.memberRemoved'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.members(folderUuid) });
    },
    onError: () => {
      toast.error(t('folder.memberRemoveError'));
    },
  });
};
