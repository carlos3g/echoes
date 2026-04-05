import { usePaginatedQuery } from '@/hooks/use-paginated-query';
import type { User } from '@/types';

interface UseUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export function useUsers(params: UseUsersParams = {}) {
  return usePaginatedQuery<User>('admin-users', '/v1/admin/users', params);
}
