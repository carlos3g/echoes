import type { ForgotPasswordOutput, ForgotPasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordOutput, HttpError<ApiResponseError<ForgotPasswordPayload>>, ForgotPasswordPayload>({
    mutationFn: async (payload) => authService.forgotPassword(payload),
    onSuccess: () => {
      toast.success('Confira seu email!', {
        description: 'Um link para redefinir sua senha foi enviado para seu email.',
      });
    },
    onError: () => {
      toast.error('Tivemos um problema!', {
        description: 'Tente novamente ou entre em contato com o suporte.',
      });
    },
  });
};
