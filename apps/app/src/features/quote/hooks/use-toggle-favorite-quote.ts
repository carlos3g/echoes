import { quoteService } from '@/features/quote/services';
import { updateQuotesCacheState } from '@/features/quote/utils';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiPaginatedResult, ApiResponseError } from '@/types/api';
import type { Quote } from '@/types/entities';
import type { HttpError } from '@/types/http';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

interface ToggleFavoriteInput {
  uuid: string;
  isFavorited: boolean;
}

export const useToggleFavoriteQuote = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    HttpError<ApiResponseError>,
    ToggleFavoriteInput,
    { previousState?: [QueryKey, InfiniteData<ApiPaginatedResult<Quote>> | undefined] }
  >({
    mutationFn: async ({ uuid, isFavorited }) =>
      isFavorited ? quoteService.unfavorite(uuid) : quoteService.favorite(uuid),
    onMutate: async ({ uuid, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.quotes.all });

      const newState = updateQuotesCacheState(queryClient, (quote) => {
        if (quote.uuid === uuid) {
          return {
            ...quote,
            metadata: {
              ...quote.metadata,
              favorites: quote.metadata.favorites + (isFavorited ? -1 : 1),
              favoritedByUser: !isFavorited,
            },
          };
        }

        return quote;
      });

      if (!newState) {
        return {};
      }

      queryClient.setQueryData(newState.queryKey, newState.state);

      return { previousState: newState.previousState };
    },
    onError: (_, __, context) => {
      if (context?.previousState) {
        const [previousStateQuery, previousStateData] = context.previousState;
        queryClient.setQueryData(previousStateQuery, previousStateData);
      }

      toast.error('Erro!', {
        description: 'Tente novamente',
      });
    },
  });
};
