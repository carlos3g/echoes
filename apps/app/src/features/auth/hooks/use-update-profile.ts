import type { UpdateProfilePayload } from '@/features/auth/contracts/auth-service.contract';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authService } from '@/features/auth/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

export const useUpdateProfile = () => {
  const { updateUser } = useAuth();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError<UpdateProfilePayload>>, UpdateProfilePayload>({
    mutationFn: async (payload) => authService.updateProfile(payload),
    onSuccess: async () => {
      await updateUser();
      toast.success(t('profile.updateSuccess'));
    },
    onError: () => {
      toast.error(t('profile.updateErrorTitle'), {
        description: t('profile.updateErrorDescription'),
      });
    },
  });
};
