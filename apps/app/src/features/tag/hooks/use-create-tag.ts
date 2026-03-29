import type { CreateTagOutput, CreateTagPayload } from '@/features/tag/contracts/tag-service.contract';
import { tagService } from '@/features/tag/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface UseCreateTagProps {
  onSuccess?: (response: CreateTagOutput) => void;
}

export const useCreateTag = ({ onSuccess }: UseCreateTagProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<CreateTagOutput, HttpError<ApiResponseError<CreateTagPayload>>, CreateTagPayload>({
    mutationFn: async (payload) => tagService.create(payload),
    onSuccess: (response) => {
      toast.success(t('tag.createSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      onSuccess?.(response);
    },
    onError: () => {
      toast.error(t('tag.createErrorTitle'), {
        description: t('tag.createErrorDescription'),
      });
    },
  });
};
