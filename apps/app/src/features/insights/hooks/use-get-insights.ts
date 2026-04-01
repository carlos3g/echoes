import type { InsightsResponse } from '@/features/insights/contracts/insights-service.contract';
import { insightsService } from '@/features/insights/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useQuery } from '@tanstack/react-query';

interface UseGetInsightsProps {
  month: string;
}

export const useGetInsights = ({ month }: UseGetInsightsProps) => {
  return useQuery<InsightsResponse, HttpError<ApiResponseError>, InsightsResponse>({
    queryKey: queryKeys.insights.monthly(month),
    queryFn: () => insightsService.get({ month }),
  });
};
