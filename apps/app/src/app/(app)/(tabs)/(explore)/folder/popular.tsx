import { View } from 'react-native';
import { usePopularFolders } from '@/features/folder/hooks/use-popular-folders';
import { FolderList } from '@/features/folder/components/folder-list';

export default function PopularFoldersScreen() {
  const { folders, isLoading, isRefetching, refetch, fetchNextPage } = usePopularFolders();

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
