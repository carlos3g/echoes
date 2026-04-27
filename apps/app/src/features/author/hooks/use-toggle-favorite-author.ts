import { authorService } from '@/features/author/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { Author } from '@/types/entities';
import type { HttpError } from '@/types/http';
import type { ApiResponseError } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface ToggleFavoriteAuthorInput {
  uuid: string;
  isFavorited: boolean;
}

export const useToggleFavoriteAuthor = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, ToggleFavoriteAuthorInput, { previousAuthor?: Author }>({
    mutationFn: async ({ uuid, isFavorited }) =>
      isFavorited ? authorService.unfavorite(uuid) : authorService.favorite(uuid),
    onMutate: async ({ uuid, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.authors.detail(uuid) });

      const previousAuthor = queryClient.getQueryData<Author>(queryKeys.authors.detail(uuid));

      if (previousAuthor) {
        queryClient.setQueryData<Author>(queryKeys.authors.detail(uuid), {
          ...previousAuthor,
          metadata: {
            ...previousAuthor.metadata,
            totalFavorites: previousAuthor.metadata.totalFavorites + (isFavorited ? -1 : 1),
            favoritedByUser: !isFavorited,
          },
        });
      }

      return { previousAuthor };
    },
    onError: (_, { uuid }, context) => {
      if (context?.previousAuthor) {
        queryClient.setQueryData(queryKeys.authors.detail(uuid), context.previousAuthor);
      }

      toast.error(t('error.generic'), {
        description: t('error.tryAgain'),
      });
    },
    onSettled: (_, __, { uuid }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.authors.detail(uuid) });
    },
  });
};
