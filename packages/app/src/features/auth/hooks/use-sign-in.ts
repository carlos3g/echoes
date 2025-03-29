import type { SignInOutput, SignInPayload } from '@/features/auth/contracts/auth-service.contract';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const useSignIn = () => {
  const { handleSignIn } = useAuth();

  return useMutation<SignInOutput, HttpError<ApiResponseError<SignInPayload>>, SignInPayload>({
    mutationFn: async (payload) => authService.signIn(payload),
    onSuccess: (response) => {
      handleSignIn(response);
    },
    onError: () => {
      toast.error('Opa!!', {
        description: 'E-mail ou senha inválidos',
      });
    },
  });
};
