import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { QuoteCardSkeleton } from '@/features/quote/components/quote-card';
import { QuoteHero } from '@/features/quote/components/quote-detail/quote-hero';
import { AuthorSection } from '@/features/quote/components/quote-detail/author-section';
import { MoreFromAuthor } from '@/features/quote/components/quote-detail/more-from-author';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { useGetQuote } from '@/features/quote/hooks/use-get-quote';

export default function QuoteScreen() {
  const { quoteUuid } = useLocalSearchParams<{ quoteUuid: string }>();
  const { data: quote, isLoading } = useGetQuote({ quoteUuid });

  if (isLoading || !quote) {
    return (
      <View className="flex-1 bg-background">
        <QuoteCardSkeleton />
      </View>
    );
  }

  return (
    <TagQuoteBottomSheetProvider>
      <Animated.View entering={FadeIn.duration(300)} className="flex-1 bg-background">
        <ScrollView contentContainerClassName="pb-8">
          <QuoteHero quote={quote} />

          {quote.author && (
            <AuthorSection
              author={{
                uuid: quote.author.uuid,
                name: quote.author.name,
                bio: quote.author.bio,
              }}
            />
          )}

          {quote.author?.uuid && (
            <MoreFromAuthor
              authorUuid={quote.author.uuid}
              authorName={quote.author.name}
              excludeQuoteUuid={quote.uuid}
            />
          )}
        </ScrollView>
      </Animated.View>
    </TagQuoteBottomSheetProvider>
  );
}
