import { usePaginatedQuery } from '@/hooks/use-paginated-query';
import type { Folder } from '@/types';

interface UseFoldersParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export function useFolders(params: UseFoldersParams = {}) {
  return usePaginatedQuery<Folder>('folders', '/v1/folders', params);
}
