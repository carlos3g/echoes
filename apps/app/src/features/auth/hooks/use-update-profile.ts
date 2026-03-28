import type { UpdateProfilePayload } from '@/features/auth/contracts/auth-service.contract';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const useUpdateProfile = () => {
  const { updateUser } = useAuth();

  return useMutation<void, HttpError<ApiResponseError<UpdateProfilePayload>>, UpdateProfilePayload>({
    mutationFn: async (payload) => authService.updateProfile(payload),
    onSuccess: async () => {
      await updateUser();
      toast.success('Perfil atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar perfil', {
        description: 'Tente novamente',
      });
    },
  });
};
