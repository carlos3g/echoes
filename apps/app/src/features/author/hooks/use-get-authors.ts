import type { ListAuthorsOutput } from '@/features/author/contracts/author-service.contract';
import { authorService } from '@/features/author/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { Author } from '@/types/entities';
import type { HttpError } from '@/types/http';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseGetAuthorsProps {
  search?: string;
}

export const useGetAuthors = ({ search }: UseGetAuthorsProps = {}) => {
  const query = useInfiniteQuery<ListAuthorsOutput, HttpError<ApiResponseError>>({
    queryKey: queryKeys.authors.list({ search }),
    queryFn: ({ pageParam }) => authorService.list({ paginate: { page: pageParam as number }, filters: { search } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
  });

  const authors: Author[] = useMemo(() => query.data?.pages.map((page) => page.data).flat() ?? [], [query.data]);

  return { ...query, authors };
};
