import type {
  CreateInviteLinkOutput,
  CreateInviteLinkPayload,
} from '@/features/folder/contracts/folder-service.contract';
import { folderService } from '@/features/folder/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface UseCreateInviteLinkProps {
  folderUuid: string;
  onSuccess?: (link: CreateInviteLinkOutput) => void;
}

export const useCreateInviteLink = ({ folderUuid, onSuccess }: UseCreateInviteLinkProps) => {
  const { t } = useTranslation();

  return useMutation<CreateInviteLinkOutput, HttpError<ApiResponseError>, CreateInviteLinkPayload>({
    mutationFn: async (payload) => folderService.createInviteLink(folderUuid, payload),
    onSuccess: (link) => {
      toast.success(t('folder.inviteLinkCreated'));
      onSuccess?.(link);
    },
    onError: () => {
      toast.error(t('folder.inviteLinkErrorTitle'));
    },
  });
};
