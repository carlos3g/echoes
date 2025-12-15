import { quoteService } from '@/features/quote/services';
import type { IsQuoteTaggedOutput } from '@/features/quote/contracts/quote-service.contract';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useQuery } from '@tanstack/react-query';

interface UseIsQuoteTaggedProps {
  quoteUuid: string;
  tagUuid: string;
}

export const useIsQuoteTagged = ({ quoteUuid, tagUuid }: UseIsQuoteTaggedProps) => {
  return useQuery<IsQuoteTaggedOutput, HttpError<ApiResponseError>, IsQuoteTaggedOutput>({
    queryKey: ['quote', 'is-tagged', quoteUuid, tagUuid],
    queryFn: () => quoteService.isTagged(quoteUuid, tagUuid),
  });
};
