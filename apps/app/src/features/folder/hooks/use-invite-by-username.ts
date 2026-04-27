import type { InviteByUsernamePayload } from '@/features/folder/contracts/folder-service.contract';
import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface UseInviteByUsernameProps {
  folderUuid: string;
  onSuccess?: () => void;
}

export const useInviteByUsername = ({ folderUuid, onSuccess }: UseInviteByUsernameProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, InviteByUsernamePayload>({
    mutationFn: async (payload) => folderService.inviteByUsername(folderUuid, payload),
    onSuccess: () => {
      toast.success(t('folder.inviteSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.members(folderUuid) });
      onSuccess?.();
    },
    onError: () => {
      toast.error(t('folder.inviteErrorTitle'));
    },
  });
};
