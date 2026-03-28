import React, { useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import type { ListRenderItem, FlashListProps } from '@shopify/flash-list';
import { FlashList as RNFlashList } from '@shopify/flash-list';
import type { Quote } from '@/types/entities';
import { QuoteCardSkeleton } from '@/features/quote/components/quote-card';
import { QuoteListItem } from './quote-list-item';
import { QuoteListSeparator } from './quote-list-separator';

// Type assertion needed due to cssInterop incompatibility
const FlashList = RNFlashList as unknown as <T>(props: FlashListProps<T>) => React.ReactElement;

const renderItem: ListRenderItem<Quote> = ({ item }) => <QuoteListItem item={item} />;

const renderItemSkeleton: ListRenderItem<Quote> = () => <QuoteCardSkeleton />;

interface QuoteListProps {
  quotes: Quote[];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({ quotes, isLoading, isRefetching, onRefresh, onEndReached }) => {
  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />,
    [isRefetching, onRefresh]
  );

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={isLoading ? Array(10).fill(null) : quotes}
        renderItem={isLoading ? renderItemSkeleton : renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ItemSeparatorComponent={QuoteListSeparator}
      />
    </View>
  );
};
