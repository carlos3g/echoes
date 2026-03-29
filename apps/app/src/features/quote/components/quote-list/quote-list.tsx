import React, { useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import type { ListRenderItem } from '@shopify/flash-list';
import type { Quote } from '@/types/entities';
import { QuoteCardSkeleton } from '@/features/quote/components/quote-card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { FlashList } from '@/shared/components/ui/flash-list';
import { QuoteListItem } from './quote-list-item';
import { useTheme } from '@/lib/nativewind/theme.context';

const renderItem: ListRenderItem<Quote> = ({ item, index }) => <QuoteListItem item={item} index={index} />;

const renderItemSkeleton: ListRenderItem<Quote> = () => <QuoteCardSkeleton />;

const QuoteListEmpty = React.memo(() => (
  <EmptyState
    icon="chatbubble-outline"
    title="Nenhuma citacao encontrada"
    description="Tente ajustar os filtros ou volte mais tarde"
  />
));

interface QuoteListProps {
  quotes: Quote[];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({ quotes, isLoading, isRefetching, onRefresh, onEndReached }) => {
  const { colors } = useTheme();

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={colors.primary} />,
    [isRefetching, onRefresh, colors.primary]
  );

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={isLoading ? Array(10).fill(null) : quotes}
        renderItem={isLoading ? renderItemSkeleton : renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ListEmptyComponent={QuoteListEmpty}
      />
    </View>
  );
};
