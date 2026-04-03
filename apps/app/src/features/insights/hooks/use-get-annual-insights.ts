import type { AnnualInsightsResponse } from '@/features/insights/contracts/insights-service.contract';
import { insightsService } from '@/features/insights/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetAnnualInsightsProps {
  year: string;
}

export const useGetAnnualInsights = ({ year }: UseGetAnnualInsightsProps) => {
  return useQuery<AnnualInsightsResponse, HttpError<ApiResponseError>, AnnualInsightsResponse>({
    queryKey: queryKeys.insights.annual(year),
    queryFn: () => insightsService.getAnnual({ year }),
  });
};
