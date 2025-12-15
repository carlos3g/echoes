import type { ChangePasswordOutput, ChangePasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const useChangePassword = () => {
  return useMutation<ChangePasswordOutput, HttpError<ApiResponseError<ChangePasswordPayload>>, ChangePasswordPayload>({
    mutationFn: async (payload) => authService.changePassword(payload),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
    },
    onError: () => {
      toast.error('Não foi possível alterar a senha!', {
        description: 'Talvez você digitou a senha atual incorretamente?',
      });
    },
  });
};
