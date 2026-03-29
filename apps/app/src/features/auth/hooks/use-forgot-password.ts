import type { ForgotPasswordOutput, ForgotPasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

export const useForgotPassword = () => {
  const { t } = useTranslation();

  return useMutation<ForgotPasswordOutput, HttpError<ApiResponseError<ForgotPasswordPayload>>, ForgotPasswordPayload>({
    mutationFn: async (payload) => authService.forgotPassword(payload),
    onSuccess: () => {
      toast.success(t('auth.forgotPassword.successTitle'), {
        description: t('auth.forgotPassword.successDescription'),
      });
    },
    onError: () => {
      toast.error(t('auth.forgotPassword.errorTitle'), {
        description: t('auth.forgotPassword.errorDescription'),
      });
    },
  });
};
