import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types';

interface UsePaginatedQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export function usePaginatedQuery<T>(
  queryKey: string,
  url: string,
  { page = 1, perPage = 10, search }: UsePaginatedQueryParams = {},
) {
  return useQuery({
    queryKey: [queryKey, { page, perPage, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
      });
      if (search) params.set('search', search);

      const { data } = await api.get<PaginatedResponse<T>>(`${url}?${params}`);
      return data;
    },
  });
}
