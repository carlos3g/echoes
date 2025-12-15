import { useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { QuoteCard, QuoteCardSkeleton, TagQuoteBottomSheetProvider } from '@/features/quote/components/quote-card';
import type { QuoteStackRouteProp, QuoteStackScreenProps } from '@/navigation/quotes.navigator.types';
import { useGetQuote } from '@/features/quote/hooks/use-get-quote';

export const QuoteScreen: React.FC<QuoteStackScreenProps<'QuoteScreen'>> = () => {
  const { params } = useRoute<QuoteStackRouteProp<'QuoteScreen'>>();
  const { quoteUuid } = params;

  const { data: quote, isLoading } = useGetQuote({ quoteUuid });

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
};
