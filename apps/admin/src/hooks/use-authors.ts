import { usePaginatedQuery } from '@/hooks/use-paginated-query';
import type { Author } from '@/types';

interface UseAuthorsParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export function useAuthors(params: UseAuthorsParams = {}) {
  return usePaginatedQuery<Author>('authors', '/v1/authors', params);
}
