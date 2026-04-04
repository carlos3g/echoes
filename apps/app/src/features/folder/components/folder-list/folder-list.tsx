import React from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Folder } from '@/types/entities';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';
import { FolderCard } from '@/features/folder/components/folder-card';

interface FolderListProps {
  folders: Folder[];
  isLoading?: boolean;
  isRefetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
}

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  isLoading,
  isRefetching,
  onRefresh,
  onEndReached,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={folders}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item, index }) => <FolderCard data={item} index={index} />}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={folders.length === 0 ? { flex: 1 } : undefined}
      ListEmptyComponent={<EmptyState title={t('folder.emptyTitle')} description={t('folder.emptyDescription')} />}
    />
  );
};
