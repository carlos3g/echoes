import { quoteService } from '@/features/quote/services';
import { updateQuotesCacheState } from '@/features/quote/utils';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { Tag } from '@/types/entities';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface useTagQuoteProps {
  tag: Tag;
}

export const useTagQuote = ({ tag }: useTagQuoteProps) => {
  const queryClient = useQueryClient();

  return useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: async (uuid) => quoteService.tag(uuid, tag.uuid),
    onSuccess: async (_, quoteUuid) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.quotes.all });

      await queryClient.invalidateQueries({ queryKey: queryKeys.quotes.isTagged(quoteUuid, tag.uuid) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });

      const newState = updateQuotesCacheState(queryClient, (quote) => {
        if (quote.uuid === quoteUuid) {
          return {
            ...quote,
            metadata: { ...quote.metadata, tags: quote.metadata.tags + 1 },
          };
        }

        return quote;
      });

      if (!newState) {
        return;
      }

      queryClient.setQueryData(newState.queryKey, newState.state);
    },
  });
};
