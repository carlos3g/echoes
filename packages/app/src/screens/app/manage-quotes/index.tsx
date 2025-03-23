import { useNavigation, useRoute } from '@react-navigation/native';
import type { ListRenderItem } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import { useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { QuoteCard, QuoteCardSkeleton, TagQuoteBottomSheetProvider } from '@/features/quote/components/quote-card';
import { Badge, BadgeIcon, BadgeText } from '@/shared/components/ui/badge';
import type { Quote } from '@/types/entities';
import type {
  QuoteStackNavigationProp,
  QuoteStackRouteProp,
  QuoteStackScreenProps,
} from '@/navigation/quotes.navigator.types';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';

const RenderItem: React.FC<{ item: Quote }> = ({ item }) => {
  const { navigate } = useNavigation();

  return (
    <QuoteCard
      data={item}
      onPress={() => navigate('QuotesNavigator', { screen: 'QuoteScreen', params: { quoteUuid: item.uuid } })}
    />
  );
};

const renderItem: ListRenderItem<Quote> = ({ item }) => <RenderItem item={item} />;

const renderItemSkeleton: ListRenderItem<Quote> = () => <QuoteCardSkeleton />;

const ItemSeparatorComponent = () => <View className="bg-[#D6D6D6]" style={{ height: StyleSheet.hairlineWidth }} />;

export const ManageQuotesScreen: React.FC<QuoteStackScreenProps<'ManageQuotesScreen'>> = () => {
  const { setParams } = useNavigation<QuoteStackNavigationProp<'ManageQuotesScreen'>>();
  const { params = {} } = useRoute<QuoteStackRouteProp<'ManageQuotesScreen'>>();
  const { tag } = params;

  const { isRefetching, refetch, fetchNextPage, quotes, isLoading } = useGetQuotes({ tagUuid: tag?.uuid });

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={refetch} />,
    [isRefetching, refetch]
  );

  const clearFilters = () => {
    setParams({ tag });
  };

  return (
    <View className="flex-1 bg-white">
      <TagQuoteBottomSheetProvider>
        {tag?.title && (
          <View className="flex-row gap-2 px-4 pt-4">
            <Badge className="pl-2" onPress={clearFilters}>
              <BadgeIcon name="close" />
              <BadgeText>{tag?.title}</BadgeText>
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
};
