import type { ListRenderItem } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { QuoteCard } from '@/features/quote/components/quote-card';
import type { ListQuotesOutput } from '@/features/quote/contracts/quote-service.contract';
import { quoteService } from '@/features/quote/services';
import type { AppTabScreenProps } from '@/navigation/app.navigator.types';
import type { Quote } from '@/types/entities';

const renderItem: ListRenderItem<Quote> = ({ item }) => <QuoteCard data={item} />;

const ItemSeparatorComponent = () => <View className="bg-[#D6D6D6]" style={{ height: StyleSheet.hairlineWidth }} />;

interface HomeScreenProps extends AppTabScreenProps<'HomeScreen'> {}

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { isRefetching, refetch, hasNextPage, fetchNextPage, data } = useInfiniteQuery<ListQuotesOutput>({
    queryKey: ['quotes'],
    queryFn: ({ pageParam }) => quoteService.list({ paginate: { page: pageParam as number } }),
    initialPageParam: 0,
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
        data={quotes}
        renderItem={renderItem}
        onEndReached={safeFetchNextPage}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  );
};
