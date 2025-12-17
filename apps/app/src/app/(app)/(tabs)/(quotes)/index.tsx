import { useRouter, useLocalSearchParams } from 'expo-router';
import type { ListRenderItem, FlashListProps } from '@shopify/flash-list';
import { FlashList as RNFlashList } from '@shopify/flash-list';
import { useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { QuoteCard, QuoteCardSkeleton, TagQuoteBottomSheetProvider } from '@/features/quote/components/quote-card';
import { Badge, BadgeIcon, BadgeText } from '@/shared/components/ui/badge';
import type { Quote } from '@/types/entities';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';

// Type assertion needed due to cssInterop incompatibility
const FlashList = RNFlashList as unknown as <T>(
  props: FlashListProps<T> & { estimatedItemSize: number }
) => React.ReactElement;

type SearchParams = {
  tagUuid?: string;
  tagTitle?: string;
};

const RenderItem: React.FC<{ item: Quote }> = ({ item }) => {
  const router = useRouter();

  return <QuoteCard data={item} onPress={() => router.push(`/(app)/(tabs)/(quotes)/${item.uuid}`)} />;
};

const renderItem: ListRenderItem<Quote> = ({ item }) => <RenderItem item={item} />;

const renderItemSkeleton: ListRenderItem<Quote> = () => <QuoteCardSkeleton />;

const ItemSeparatorComponent = () => <View className="bg-[#D6D6D6]" style={{ height: StyleSheet.hairlineWidth }} />;

export default function ManageQuotesScreen() {
  const router = useRouter();
  const { tagUuid, tagTitle } = useLocalSearchParams<SearchParams>();

  const { isRefetching, refetch, fetchNextPage, quotes, isLoading } = useGetQuotes({ tagUuid });

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={refetch} />,
    [isRefetching, refetch]
  );

  const clearFilters = () => {
    router.setParams({ tagUuid: undefined, tagTitle: undefined });
  };

  return (
    <View className="flex-1 bg-white">
      <TagQuoteBottomSheetProvider>
        {tagTitle && (
          <View className="flex-row gap-2 px-4 pt-4">
            <Badge className="pl-2" onPress={clearFilters}>
              <BadgeIcon name="close" />
              <BadgeText>{tagTitle}</BadgeText>
            </Badge>
          </View>
        )}

        <FlashList
          estimatedItemSize={166}
          data={isLoading ? Array(10).fill(null) : quotes}
          renderItem={isLoading ? renderItemSkeleton : renderItem}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          refreshControl={refreshControl}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      </TagQuoteBottomSheetProvider>
    </View>
  );
}
