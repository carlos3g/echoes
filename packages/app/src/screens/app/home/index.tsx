import { useRoute } from '@react-navigation/native';
import type { ListRenderItem } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import type { Quote } from '@/types/entities';
import type { AppTabRouteProp, AppTabScreenProps } from '@/navigation/app.navigator.types';
import { quoteService } from '@/features/quote/services';
import type { ListQuotesOutput } from '@/features/quote/contracts/quote-service.contract';
import { QuoteCard, QuoteCardSkeleton } from '@/features/quote/components/quote-card';

const renderItem: ListRenderItem<Quote> = ({ item }) => <QuoteCard data={item} />;

const renderItemSkeleton: ListRenderItem<Quote> = () => <QuoteCardSkeleton />;

const ItemSeparatorComponent = () => <View className="bg-[#D6D6D6]" style={{ height: StyleSheet.hairlineWidth }} />;

interface HomeScreenProps extends AppTabScreenProps<'HomeScreen'> {}

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { params } = useRoute<AppTabRouteProp<'HomeScreen'>>();
  const { tagUuid } = params || {};

  const { isRefetching, refetch, hasNextPage, fetchNextPage, data, isLoading } = useInfiniteQuery<ListQuotesOutput>({
    queryKey: ['quotes', { tagUuid }],
    queryFn: ({ pageParam }) => quoteService.list({ paginate: { page: pageParam as number }, filters: { tagUuid } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
  });

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={refetch} />,
    [isRefetching, refetch]
  );

  const quotes: Quote[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  const safeFetchNextPage = useCallback(() => {
    if (hasNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  return (
    <View className="flex-1 bg-white">
      <FlashList
        estimatedItemSize={166}
        data={isLoading ? Array(10).fill(null) : quotes}
        renderItem={isLoading ? renderItemSkeleton : renderItem}
        onEndReached={safeFetchNextPage}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  );
};
