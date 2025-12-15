import type { ResetPasswordOutput, ResetPasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const useResetPassword = () => {
  return useMutation<ResetPasswordOutput, HttpError<ApiResponseError<ResetPasswordPayload>>, ResetPasswordPayload>({
    mutationFn: async (payload) => authService.resetPassword(payload),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!', {
        description: 'Faça login com sua nova senha',
      });
    },
    onError: () => {
      toast.error('Tivemos um problema!', {
        description: 'Tente novamente ou entre em contato com o suporte.',
      });
    },
  });
};
