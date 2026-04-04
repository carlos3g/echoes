import React from 'react';
import { FlatList, type ListRenderItem, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { User } from '@/types/entities';
import { UserCard } from '@/features/user/components/user-card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  isRefetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
}

export const UserList: React.FC<UserListProps> = ({ users, isLoading, isRefetching, onRefresh, onEndReached }) => {
  const { t } = useTranslation();

  const renderItem: ListRenderItem<User> = ({ item, index }) => <UserCard data={item} index={index} />;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.uuid}
      contentContainerClassName="pb-8 pt-2"
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      ListEmptyComponent={<EmptyState title={t('user.emptyList')} />}
    />
  );
};
