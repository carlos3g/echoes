import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import { queryKeys } from '@/lib/react-query/query-keys';
import { userService } from '@/features/user/services';
import type { HttpError } from '@/types/http';
import type { ApiResponseError } from '@/types/api';

export const useFollowUser = (username: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, void>({
    mutationFn: () => userService.follow(username),
    onSuccess: () => {
      toast.success(t('user.followSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(username) });
    },
    onError: () => {
      toast.error(t('user.followError'));
    },
  });
};
