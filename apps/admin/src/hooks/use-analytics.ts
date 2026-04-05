import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { AnalyticsOverview, QuoteActivityPoint, UserGrowthPoint } from '@/types';

const ANALYTICS_STALE_TIME = 1000 * 60;

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const { data } = await api.get<AnalyticsOverview>('/v1/admin/analytics/overview');
      return data;
    },
    staleTime: ANALYTICS_STALE_TIME,
    placeholderData: {
      totalUsers: 0,
      totalQuotes: 0,
      totalAuthors: 0,
      totalFolders: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      newUsersThisMonth: 0,
      quotesViewedToday: 0,
    },
  });
}

export function useUserGrowth() {
  return useQuery({
    queryKey: ['analytics', 'user-growth'],
    queryFn: async () => {
      const { data } = await api.get<UserGrowthPoint[]>('/v1/admin/analytics/user-growth');
      return data;
    },
    staleTime: ANALYTICS_STALE_TIME,
    placeholderData: [],
  });
}

export function useQuoteActivity() {
  return useQuery({
    queryKey: ['analytics', 'quote-activity'],
    queryFn: async () => {
      const { data } = await api.get<QuoteActivityPoint[]>('/v1/admin/analytics/quote-activity');
      return data;
    },
    staleTime: ANALYTICS_STALE_TIME,
    placeholderData: [],
  });
}
