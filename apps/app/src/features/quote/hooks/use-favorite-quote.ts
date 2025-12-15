import { quoteService } from '@/features/quote/services';
import { updateQuotesCacheState } from '@/features/quote/utils';
import type { ApiPaginatedResult, ApiResponseError } from '@/types/api';
import type { Quote } from '@/types/entities';
import type { HttpError } from '@/types/http';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const useFavoriteQuote = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    HttpError<ApiResponseError>,
    string,
    { previousState?: [QueryKey, InfiniteData<ApiPaginatedResult<Quote>> | undefined] }
  >({
    mutationFn: async (uuid) => quoteService.favorite(uuid),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: ['quotes'] });

      const newState = updateQuotesCacheState(queryClient, (quote) => {
        if (quote.uuid === uuid) {
          return {
            ...quote,
            metadata: { ...quote.metadata, favorites: quote.metadata.favorites + 1, favoritedByUser: true },
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
