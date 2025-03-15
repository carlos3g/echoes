import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';
import { QuoteCard, QuoteCardSkeleton, TagQuoteBottomSheetProvider } from '@/features/quote/components/quote-card';
import { quoteService } from '@/features/quote/services';
import type { QuoteStackRouteProp } from '@/navigation/quotes.navigator.types';

interface QuoteScreenProps {}

export const QuoteScreen: React.FC<QuoteScreenProps> = () => {
  const { params } = useRoute<QuoteStackRouteProp<'QuoteScreen'>>();
  const { quoteUuid } = params;

  const { data: quote, isLoading } = useQuery({
    queryKey: ['quote', quoteUuid],
    queryFn: () => quoteService.get(quoteUuid),
  });

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
