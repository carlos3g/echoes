import React from 'react';
import { Text as RNText, View } from 'react-native';
import type { Quote } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { useReadingStyle } from '@/shared/hooks/use-reading-style';
import { useTheme } from '@/lib/nativewind/theme.context';
import { DecorativeQuoteMark } from '@/shared/components/ui/decorative-quote-mark';
import { FavoriteButton } from '@/features/quote/components/quote-card/favorite-button';
import { TagButton } from '@/features/quote/components/quote-card/tag-button';
import { CopyButton } from '@/features/quote/components/quote-card/copy-button';
import { ShareButton } from '@/features/quote/components/quote-card/share-button';

interface QuoteHeroProps {
  quote: Quote;
}

export const QuoteHero: React.FC<QuoteHeroProps> = ({ quote }) => {
  const { quoteLargeStyle } = useReadingStyle();
  const { colors } = useTheme();

  return (
    <View className="items-center px-8 py-6">
      <DecorativeQuoteMark size={64} />

      <RNText style={[quoteLargeStyle, { color: colors.foreground, textAlign: 'center', marginTop: 8 }]}>
        {quote.body}
      </RNText>

      <View className="my-5 h-[1.5px] w-[50px] bg-primary" />

      <Text variant="paragraphCaption" semiBold className="text-center uppercase tracking-widest text-secondary">
        {quote.author?.name ?? 'Autor desconhecido'}
      </Text>

      <View className="mt-6 flex-row items-center gap-6">
        <FavoriteButton data={quote} />
        <TagButton data={quote} />
        <CopyButton data={quote} />
        <ShareButton data={quote} />
      </View>
    </View>
  );
};
