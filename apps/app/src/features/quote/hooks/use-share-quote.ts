import type { ShareQuotePayload } from '@/features/quote/contracts/quote-service.contract';
import { quoteService } from '@/features/quote/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ShareQuoteInput {
  uuid: string;
  payload: ShareQuotePayload;
}

export const useShareQuote = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ShareQuoteInput>({
    mutationFn: async ({ uuid, payload }) => quoteService.share(uuid, payload),
    onSuccess: (_, { uuid }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.quotes.detail(uuid) });
    },
  });
};
