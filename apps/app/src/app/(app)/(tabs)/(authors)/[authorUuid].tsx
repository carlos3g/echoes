import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetAuthor } from '@/features/author/hooks/use-get-author';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';
import { Text } from '@/shared/components/ui/text';
import { QuoteList } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';

export default function AuthorDetailScreen() {
  const { authorUuid } = useLocalSearchParams<{ authorUuid: string }>();
  const { data: author } = useGetAuthor({ authorUuid: authorUuid! });

  return (
    <View className="flex-1 bg-background">
      {author && (
        <View className="border-b border-border px-4 py-4">
          <Text variant="headingMedium" className="text-foreground">
            {author.name}
          </Text>
          {author.bio && (
            <Text variant="paragraphSmall" className="mt-2 text-muted-foreground">
              {author.bio}
            </Text>
          )}
        </View>
      )}

      <TagQuoteBottomSheetProvider>
        <AuthorQuotes authorUuid={authorUuid!} />
      </TagQuoteBottomSheetProvider>
    </View>
  );
}

function AuthorQuotes({ authorUuid }: { authorUuid: string }) {
  const { quotes, isLoading, isRefetching, refetch, fetchNextPage } = useGetQuotes({ authorUuid });

  return (
    <QuoteList
      quotes={quotes}
      isLoading={isLoading}
      isRefetching={isRefetching}
      onRefresh={refetch}
      onEndReached={fetchNextPage}
    />
  );
}
