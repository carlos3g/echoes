import { categoryService } from '@/features/category/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { Category } from '@/types/entities';
import { useQuery } from '@tanstack/react-query';

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryService.list({ paginate: { page: 1, perPage: 100 } }),
    staleTime: 5 * 60 * 1000,
  });

  const categories: Category[] = query.data?.data ?? [];

  return { ...query, categories };
};
