import React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useFeed } from '@/features/folder/hooks/use-feed';
import { Text } from '@/shared/components/ui/text';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';
import { useTheme } from '@/lib/nativewind/theme.context';
import type { FeedEvent } from '@/types/entities';

const FeedEventItem: React.FC<{ event: FeedEvent }> = React.memo(({ event }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const handleFolderPress = () => {
    if (event.folder?.uuid) {
      router.push({
        pathname: '/(app)/(tabs)/(explore)/folder/[folderUuid]',
        params: { folderUuid: event.folder.uuid },
      });
    }
  };

  return (
    <Pressable className="mx-4 my-1.5 rounded-xl border border-border bg-card p-4" onPress={handleFolderPress}>
      <View className="flex-row items-center gap-2">
        <Ionicons name="person-circle-outline" size={20} color={colors.mutedForeground} />
        <Text variant="paragraphSmall" semiBold>
          {event.actor.name}
        </Text>
      </View>

      <Text variant="paragraphSmall" className="mt-2 text-muted-foreground">
        {t('feed.quoteAddedToFolder', {
          folder: event.folder?.name ?? '',
        })}
      </Text>

      {event.quote?.body && (
        <View className="mt-2 rounded-lg bg-muted p-3">
          <Text variant="paragraphSmall" className="text-foreground" numberOfLines={3}>
            &ldquo;{event.quote.body}&rdquo;
          </Text>
        </View>
      )}

      <Text variant="paragraphCaptionSmall" className="mt-2 text-muted-foreground">
        {new Date(event.createdAt).toLocaleDateString()}
      </Text>
    </Pressable>
  );
});

export default function FeedScreen() {
  const { t } = useTranslation();
  const { events, isLoading, isRefetching, refetch, fetchNextPage } = useFeed();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item.type}-${String(item.createdAt)}-${index}`}
        renderItem={({ item }) => <FeedEventItem event={item} />}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReached={() => void fetchNextPage()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={events.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
        ListEmptyComponent={
          <EmptyState icon="newspaper-outline" title={t('feed.emptyTitle')} description={t('feed.emptyDescription')} />
        }
      />
    </View>
  );
}
