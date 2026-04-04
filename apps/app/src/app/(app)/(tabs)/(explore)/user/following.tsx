import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUserFollowing } from '@/features/user/hooks/use-user-following';
import { UserList } from '@/features/user/components/user-list';

export default function UserFollowingScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { users, isLoading, isRefetching, refetch, fetchNextPage } = useUserFollowing(username);

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
