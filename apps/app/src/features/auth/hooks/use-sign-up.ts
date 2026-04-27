import type { SignUpOutput, SignUpPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface UseSignUpProps {
  onSuccess: (response: SignUpOutput) => void;
}

export const useSignUp = ({ onSuccess }: UseSignUpProps) => {
  const { t } = useTranslation();

  return useMutation<SignUpOutput, HttpError<ApiResponseError<SignUpPayload>>, SignUpPayload>({
    mutationFn: async (payload) => authService.signUp(payload),
    onSuccess,
    onError: () => {
      toast.error(t('auth.signUp.errorTitle'), {
        description: t('auth.signUp.errorDescription'),
      });
    },
  });
};
