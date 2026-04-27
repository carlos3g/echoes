import type { ChangePasswordOutput, ChangePasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

export const useChangePassword = () => {
  const { t } = useTranslation();

  return useMutation<ChangePasswordOutput, HttpError<ApiResponseError<ChangePasswordPayload>>, ChangePasswordPayload>({
    mutationFn: async (payload) => authService.changePassword(payload),
    onSuccess: () => {
      toast.success(t('auth.changePassword.successTitle'));
    },
    onError: () => {
      toast.error(t('auth.changePassword.errorTitle'), {
        description: t('auth.changePassword.errorDescription'),
      });
    },
  });
};
