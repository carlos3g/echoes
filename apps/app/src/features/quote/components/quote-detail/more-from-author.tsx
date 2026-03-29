import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';
import { QuoteCardMini } from '@/features/quote/components/quote-card/quote-card-mini';
import { Text } from '@/shared/components/ui/text';

interface MoreFromAuthorProps {
  authorUuid: string;
  authorName: string;
  excludeQuoteUuid: string;
}

export const MoreFromAuthor: React.FC<MoreFromAuthorProps> = ({ authorUuid, authorName, excludeQuoteUuid }) => {
  const router = useRouter();
  const { quotes } = useGetQuotes({ authorUuid });

  const filtered = useMemo(
    () => quotes.filter((q) => q.uuid !== excludeQuoteUuid).slice(0, 3),
    [quotes, excludeQuoteUuid]
  );

  if (filtered.length === 0) return null;

  return (
    <View className="border-t border-border px-4 pb-8 pt-5">
      <Text variant="paragraphSmall" semiBold className="mb-3 px-2 text-foreground">
        Mais de {authorName}
      </Text>
      {filtered.map((quote) => (
        <QuoteCardMini
          key={quote.uuid}
          data={quote}
          onPress={() => router.push(`/(app)/(tabs)/(explore)/quote/${quote.uuid}`)}
        />
      ))}
    </View>
  );
};
