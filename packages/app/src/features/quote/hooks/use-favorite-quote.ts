import { quoteService } from '@/features/quote/services';
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

      // TODO: get previousState using queryClient.getQueryData. Needs to get quotes filters first
      const queriesData = queryClient.getQueriesData<InfiniteData<ApiPaginatedResult<Quote>>>({
        queryKey: ['quotes'],
      });

      const previousState = queriesData.find((qData) => {
        const [_, queryData] = qData;

        return !!queryData?.pageParams;
      });

      const [previousStateQuery, previousStateData] = previousState || [];

      if (!previousStateData || !previousStateQuery) {
        return {};
      }

      const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
        pageParams: previousStateData?.pageParams,
        pages: previousStateData?.pages?.map((page) => {
          const quotes = page.data.map((quote) => {
            if (quote.uuid === uuid) {
              return {
                ...quote,
                metadata: { ...quote.metadata, favorites: quote.metadata.favorites + 1, favoritedByUser: true },
              };
            }

            return quote;
          });

          return {
            ...page,
            data: quotes,
          };
        }),
      };

      queryClient.setQueryData(previousStateQuery, newState);

      return { previousState };
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
