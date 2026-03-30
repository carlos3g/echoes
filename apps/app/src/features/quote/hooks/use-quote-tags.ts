import type { ListQuoteTagsOutput } from '@/features/quote/contracts/quote-service.contract';
import { quoteService } from '@/features/quote/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useQuery } from '@tanstack/react-query';

interface UseQuoteTagsProps {
  quoteUuid: string;
  enabled?: boolean;
}

export const useQuoteTags = ({ quoteUuid, enabled = true }: UseQuoteTagsProps) => {
  return useQuery<ListQuoteTagsOutput, HttpError<ApiResponseError>>({
    queryKey: queryKeys.quotes.tags(quoteUuid),
    queryFn: () => quoteService.listTags(quoteUuid),
    enabled,
  });
};
