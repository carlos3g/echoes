import { tagService } from '@/features/tag/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface UseDeleteTagProps {
  onSuccess?: () => void;
}

export const useDeleteTag = ({ onSuccess }: UseDeleteTagProps = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: async (uuid) => tagService.delete(uuid),
    onSuccess: () => {
      toast.success(t('tag.deleteSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      onSuccess?.();
    },
    onError: () => {
      toast.error(t('tag.deleteErrorTitle'), {
        description: t('tag.deleteErrorDescription'),
      });
    },
  });
};
