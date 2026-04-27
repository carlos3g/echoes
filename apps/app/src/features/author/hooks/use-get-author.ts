import { authorService } from '@/features/author/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { Author } from '@/types/entities';
import { useQuery } from '@tanstack/react-query';

interface UseGetAuthorProps {
  authorUuid: string;
}

export const useGetAuthor = ({ authorUuid }: UseGetAuthorProps) => {
  return useQuery<Author>({
    queryKey: queryKeys.authors.detail(authorUuid),
    queryFn: () => authorService.get(authorUuid),
  });
};
