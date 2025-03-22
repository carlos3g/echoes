import { quoteService } from '@/features/quote/services';
import type { ApiResponseError } from '@/types/api';
import type { Quote } from '@/types/entities';
import type { HttpError } from '@/types/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetQuoteProps {
  quoteUuid: string;
}

export const useGetQuote = ({ quoteUuid }: UseGetQuoteProps) => {
  return useQuery<Quote, HttpError<ApiResponseError>, Quote>({
    queryKey: ['quote', quoteUuid],
    queryFn: () => quoteService.get(quoteUuid),
  });
};
