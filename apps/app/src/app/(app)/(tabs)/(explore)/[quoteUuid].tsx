import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { QuoteCard, QuoteCardSkeleton } from '@/features/quote/components/quote-card';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { useGetQuote } from '@/features/quote/hooks/use-get-quote';

export default function QuoteScreen() {
  const { quoteUuid } = useLocalSearchParams<{ quoteUuid: string }>();

  const { data: quote, isLoading } = useGetQuote({ quoteUuid: quoteUuid });

  if (isLoading || !quote) {
    return (
      <View className="flex-1 bg-background">
        <QuoteCardSkeleton />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        <QuoteCard data={quote} />
      </TagQuoteBottomSheetProvider>
    </View>
  );
}
