import type { SignInOutput, SignInPayload } from '@/features/auth/contracts/auth-service.contract';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

export const useSignIn = () => {
  const { handleSignIn } = useAuth();
  const { t } = useTranslation();

  return useMutation<SignInOutput, HttpError<ApiResponseError<SignInPayload>>, SignInPayload>({
    mutationFn: async (payload) => authService.signIn(payload),
    onSuccess: (response) => {
      handleSignIn(response);
    },
    onError: () => {
      toast.error(t('auth.signIn.errorTitle'), {
        description: t('auth.signIn.errorDescription'),
      });
    },
  });
};
