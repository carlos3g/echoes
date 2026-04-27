import type { UpdateTagOutput, UpdateTagPayload } from '@/features/tag/contracts/tag-service.contract';
import { tagService } from '@/features/tag/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface UseUpdateTagProps {
  onSuccess?: () => void;
}

export const useUpdateTag = ({ onSuccess }: UseUpdateTagProps = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<UpdateTagOutput, HttpError<ApiResponseError>, { uuid: string } & UpdateTagPayload>({
    mutationFn: async ({ uuid, title }) => tagService.update(uuid, { title }),
    onSuccess: () => {
      toast.success(t('tag.updateSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      onSuccess?.();
    },
    onError: () => {
      toast.error(t('tag.updateErrorTitle'), {
        description: t('tag.updateErrorDescription'),
      });
    },
  });
};
