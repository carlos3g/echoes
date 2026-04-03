import type { CompareMonthsResponse } from '@/features/insights/contracts/insights-service.contract';
import { insightsService } from '@/features/insights/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useQuery } from '@tanstack/react-query';

interface UseCompareMonthsProps {
  monthA: string;
  monthB: string;
  enabled?: boolean;
}

export const useCompareMonths = ({ monthA, monthB, enabled = true }: UseCompareMonthsProps) => {
  return useQuery<CompareMonthsResponse, HttpError<ApiResponseError>, CompareMonthsResponse>({
    queryKey: queryKeys.insights.compare(monthA, monthB),
    queryFn: () => insightsService.compare({ monthA, monthB }),
    enabled,
  });
};
