import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { QuoteCard, QuoteCardSkeleton, TagQuoteBottomSheetProvider } from '@/features/quote/components/quote-card';
import { useGetQuote } from '@/features/quote/hooks/use-get-quote';

export default function QuoteScreen() {
  const { quoteUuid } = useLocalSearchParams<{ quoteUuid: string }>();

  const { data: quote, isLoading } = useGetQuote({ quoteUuid: quoteUuid });

  if (isLoading || !quote) {
    return (
      <View className="flex-1 bg-white">
        <QuoteCardSkeleton />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <TagQuoteBottomSheetProvider>
        <QuoteCard data={quote} />
      </TagQuoteBottomSheetProvider>
    </View>
  );
}
