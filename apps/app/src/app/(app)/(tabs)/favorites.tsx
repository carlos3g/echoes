import { View } from 'react-native';
import { QuoteList } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';

export default function FavoritesScreen() {
  const { isRefetching, refetch, fetchNextPage, quotes, isLoading } = useGetQuotes({ favoritesOnly: true });

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        <QuoteList
          quotes={quotes}
          isLoading={isLoading}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onEndReached={fetchNextPage}
        />
      </TagQuoteBottomSheetProvider>
    </View>
  );
}
