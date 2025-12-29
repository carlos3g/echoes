import React, { useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import type { ListRenderItem, FlashListProps } from '@shopify/flash-list';
import { FlashList as RNFlashList } from '@shopify/flash-list';
import type { Tag } from '@/types/entities';
import { TagCardSkeleton } from '@/features/tag/components/tag-card';
import { TagListItem } from './tag-list-item';
import { TagListEmpty } from './tag-list-empty';
import { TagListSeparator } from './tag-list-separator';

// Type assertion needed due to cssInterop incompatibility
const FlashList = RNFlashList as unknown as <T>(
  props: FlashListProps<T> & { estimatedItemSize: number }
) => React.ReactElement;

const renderItem: ListRenderItem<Tag> = ({ item }) => <TagListItem item={item} />;

const renderItemSkeleton: ListRenderItem<Tag> = () => <TagCardSkeleton />;

interface TagListProps {
  tags: Tag[];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
}

export const TagList: React.FC<TagListProps> = ({ tags, isLoading, isRefetching, onRefresh, onEndReached }) => {
  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />,
    [isRefetching, onRefresh]
  );

  return (
    <View className="flex-1 bg-background">
      <FlashList
        estimatedItemSize={56}
        data={isLoading ? Array(10).fill(null) : tags}
        renderItem={isLoading ? renderItemSkeleton : renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ItemSeparatorComponent={TagListSeparator}
        ListEmptyComponent={TagListEmpty}
      />
    </View>
  );
};
