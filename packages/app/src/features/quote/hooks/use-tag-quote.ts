import { quoteService } from '@/features/quote/services';
import type { ApiPaginatedResult, ApiResponseError } from '@/types/api';
import type { Quote, Tag } from '@/types/entities';
import type { HttpError } from '@/types/http';
import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface useTagQuoteProps {
  tag: Tag;
}

export const useTagQuote = ({ tag }: useTagQuoteProps) => {
  const queryClient = useQueryClient();

  return useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: async (uuid) => quoteService.tag(uuid, tag.uuid),
    onSuccess: async (_, quoteUuid) => {
      await queryClient.cancelQueries({ queryKey: ['quotes'] });

      await queryClient.invalidateQueries({ queryKey: ['quote', 'is-tagged', quoteUuid, tag.uuid] });
      await queryClient.invalidateQueries({ queryKey: ['tags'] });

      // TODO: get previousState using queryClient.getQueryData. Needs to get quotes filters first
      const queriesData = queryClient.getQueriesData<InfiniteData<ApiPaginatedResult<Quote>>>({
        queryKey: ['quotes'],
      });

      const previousState = queriesData.find((qData) => {
        const [__, queryData] = qData;

        return !!queryData?.pageParams;
      });

      const [previousStateQuery, previousStateData] = previousState || [];

      if (!previousStateData || !previousStateQuery) {
        return {};
      }

      const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
        pageParams: previousStateData?.pageParams,
        pages: previousStateData?.pages?.map((page) => {
          const quotes = page.data.map((q) => {
            if (q.uuid === quoteUuid) {
              return {
                ...q,
                metadata: { ...q.metadata, tags: q.metadata.tags + 1 },
              };
            }

            return q;
          });

          return {
            ...page,
            data: quotes,
          };
        }),
      };

      queryClient.setQueryData(previousStateQuery, newState);
    },
  });
};
