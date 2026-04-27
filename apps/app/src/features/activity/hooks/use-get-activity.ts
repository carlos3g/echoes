import type { ActivityItemResponse, ActivityResponse } from '@/features/activity/contracts/activity-service.contract';
import { activityService } from '@/features/activity/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useGetActivity = () => {
  const query = useInfiniteQuery<ActivityResponse, HttpError<ApiResponseError>>({
    queryKey: queryKeys.activity.all,
    queryFn: ({ pageParam }) => activityService.list({ page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });

  const items: ActivityItemResponse[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  );

  return { ...query, items };
};
