import type { CreateTagOutput, CreateTagPayload } from '@/features/tag/contracts/tag-service.contract';
import { tagService } from '@/features/tag/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

interface UseCreateTagProps {
  onSuccess?: (response: CreateTagOutput) => void;
}

export const useCreateTag = ({ onSuccess }: UseCreateTagProps) => {
  const queryClient = useQueryClient();

  return useMutation<CreateTagOutput, HttpError<ApiResponseError<CreateTagPayload>>, CreateTagPayload>({
    mutationFn: async (payload) => tagService.create(payload),
    onSuccess: (response) => {
      toast.success('Tag criada com sucesso!');
      void queryClient.invalidateQueries({ queryKey: ['tags'] });
      onSuccess?.(response);
    },
    onError: () => {
      toast.error('Tivemos um erro :/', {
        description: 'Tente novamente',
      });
    },
  });
};
