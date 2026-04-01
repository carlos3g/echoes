import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGetActivity } from '@/features/activity/hooks/use-get-activity';
import { ActivityItem } from '@/features/activity/components/activity-item';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import type { ActivityItemResponse } from '@/features/activity/contracts/activity-service.contract';

export default function ActivityScreen() {
  const { t } = useTranslation();
  const { items, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetActivity();

  const renderItem = useCallback(
    ({ item, index }: { item: ActivityItemResponse; index: number }) => <ActivityItem item={item} index={index} />,
    []
  );

  const keyExtractor = useCallback(
    (item: ActivityItemResponse, index: number) => `${item.type}-${item.timestamp}-${index}`,
    []
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-8">
        <Text variant="paragraphMedium" className="text-center text-muted-foreground">
          {t('error.description')}
        </Text>
        <Button title={t('error.retry')} onPress={() => refetch()} variant="outline" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState icon="time-outline" title={t('activity.emptyTitle')} description={t('activity.emptyDescription')} />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      className="flex-1 bg-background"
      contentContainerClassName="pb-8"
      ListFooterComponent={
        hasNextPage ? (
          <View className="px-4 pt-4">
            <Button
              title={t('activity.loadMore')}
              onPress={() => fetchNextPage()}
              variant="outline"
              loading={isFetchingNextPage}
            />
          </View>
        ) : null
      }
    />
  );
}
