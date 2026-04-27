import type { ResetPasswordOutput, ResetPasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

export const useResetPassword = () => {
  const { t } = useTranslation();

  return useMutation<ResetPasswordOutput, HttpError<ApiResponseError<ResetPasswordPayload>>, ResetPasswordPayload>({
    mutationFn: async (payload) => authService.resetPassword(payload),
    onSuccess: () => {
      toast.success(t('auth.resetPassword.successTitle'), {
        description: t('auth.resetPassword.successDescription'),
      });
    },
    onError: () => {
      toast.error(t('auth.resetPassword.errorTitle'), {
        description: t('auth.resetPassword.errorDescription'),
      });
    },
  });
};
