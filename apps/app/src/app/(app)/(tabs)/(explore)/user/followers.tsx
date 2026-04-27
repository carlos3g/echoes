import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUserFollowers } from '@/features/user/hooks/use-user-followers';
import { UserList } from '@/features/user/components/user-list';

export default function UserFollowersScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { users, isLoading, isRefetching, refetch, fetchNextPage } = useUserFollowers(username);

  return (
    <View className="flex-1 bg-background">
      <UserList
        users={users}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onRefresh={refetch}
        onEndReached={fetchNextPage}
      />
    </View>
  );
}
