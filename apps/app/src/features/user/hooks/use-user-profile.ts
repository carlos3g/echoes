import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query/query-keys';
import { userService } from '@/features/user/services';

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: queryKeys.users.profile(username),
    queryFn: () => userService.getProfile(username),
    enabled: !!username,
  });
};
