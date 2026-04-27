import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUserPublicFolders } from '@/features/folder/hooks/use-user-public-folders';
import { FolderList } from '@/features/folder/components/folder-list';

export default function UserPublicFoldersScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { folders, isLoading, isRefetching, refetch, fetchNextPage } = useUserPublicFolders(username);

  return (
    <View className="flex-1 bg-background">
      <FolderList
        folders={folders}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onRefresh={refetch}
        onEndReached={fetchNextPage}
      />
    </View>
  );
}
