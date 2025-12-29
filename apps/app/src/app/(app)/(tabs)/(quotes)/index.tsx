import { useRouter, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { QuoteList, QuoteFilterBadge } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';

type SearchParams = {
  tagUuid?: string;
  tagTitle?: string;
};

export default function ManageQuotesScreen() {
  const router = useRouter();
  const { tagUuid, tagTitle } = useLocalSearchParams<SearchParams>();

  const { isRefetching, refetch, fetchNextPage, quotes, isLoading } = useGetQuotes({ tagUuid });

  const clearFilters = () => {
    router.setParams({ tagUuid: undefined, tagTitle: undefined });
  };

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        {tagTitle && <QuoteFilterBadge tagTitle={tagTitle} onClear={clearFilters} />}

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
