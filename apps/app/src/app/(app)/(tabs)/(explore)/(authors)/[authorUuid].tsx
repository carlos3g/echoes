import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetAuthor } from '@/features/author/hooks/use-get-author';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';
import { Text } from '@/shared/components/ui/text';
import { QuoteList } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { useTheme } from '@/lib/nativewind/theme.context';

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary">
      <Text variant="headingMedium" bold className="text-secondary-foreground">
        {initials}
      </Text>
    </View>
  );
}

function AuthorBio({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = bio.length > 150;

  return (
    <View className="mt-4">
      <Text variant="paragraphSmall" className="text-muted-foreground" numberOfLines={expanded ? undefined : 3}>
        {bio}
      </Text>
      {isLong && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)} className="mt-1">
          <Text variant="paragraphSmall" semiBold className="text-secondary">
            {expanded ? 'Ler menos' : 'Ler mais'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function AuthorStats({ quotesCount, favoritesCount }: { quotesCount: number; favoritesCount: number }) {
  return (
    <View className="mt-4 flex-row gap-3">
      <View className="flex-1 items-center rounded-xl bg-muted py-3">
        <Text variant="headingSmall" bold className="text-foreground">
          {quotesCount}
        </Text>
        <Text variant="paragraphCaption" className="text-muted-foreground">
          Citacoes
        </Text>
      </View>
      <View className="flex-1 items-center rounded-xl bg-muted py-3">
        <Text variant="headingSmall" bold className="text-foreground">
          {favoritesCount}
        </Text>
        <Text variant="paragraphCaption" className="text-muted-foreground">
          Favoritado
        </Text>
      </View>
    </View>
  );
}

export default function AuthorDetailScreen() {
  const { authorUuid } = useLocalSearchParams<{ authorUuid: string }>();
  const { data: author } = useGetAuthor({ authorUuid: authorUuid! });

  return (
    <View className="flex-1 bg-background">
      {author && (
        <View className="border-b border-border px-6 pb-6 pt-4">
          <View className="flex-row items-center gap-4">
            <AuthorAvatar name={author.name} />
            <View className="flex-1">
              <Text className="font-playfair-semi-bold text-heading-medium text-foreground">{author.name}</Text>
            </View>
          </View>

          {author.bio && <AuthorBio bio={author.bio} />}
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
