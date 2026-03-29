import React, { useCallback } from 'react';
import { Pressable, Text as RNText, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Quote } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { useReadingStyle } from '@/shared/hooks/use-reading-style';
import { useTheme } from '@/lib/nativewind/theme.context';
import { $shadowProps } from '@/shared/theme/theme';
import { FavoriteButton } from './favorite-button';
import { TagButton } from './tag-button';
import { CopyButton } from './copy-button';
import { ShareButton } from './share-button';

interface QuoteCardMiniProps {
  data: Quote;
  onPress?: () => void;
}

export const QuoteCardMini: React.FC<QuoteCardMiniProps> = React.memo(({ data, onPress }) => {
  const router = useRouter();
  const { quoteStyle } = useReadingStyle();
  const { colors } = useTheme();

  const handleAuthorPress = useCallback(() => {
    if (data.author?.uuid) {
      router.push({
        pathname: '/(app)/(tabs)/(explore)/(authors)/[authorUuid]',
        params: { authorUuid: data.author.uuid },
      });
    }
  }, [data.author?.uuid, router]);

  return (
    <Pressable
      onPress={onPress}
      className="mx-2 my-1.5 rounded-xl border border-border bg-card p-4"
      style={$shadowProps}
    >
      <RNText style={[quoteStyle, { color: colors.foreground }]}>{data.body}</RNText>

      <View className="my-3 h-[1.5px] w-8 bg-primary" />

      {data.author?.name ? (
        <TouchableOpacity onPress={handleAuthorPress} accessibilityRole="link">
          <Text variant="paragraphCaptionSmall" semiBold className="uppercase tracking-widest text-secondary">
            {data.author.name}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text variant="paragraphCaptionSmall" className="uppercase tracking-widest text-muted-foreground">
          Autor desconhecido
        </Text>
      )}

      <View className="mt-4 flex-row justify-between">
        <View className="flex-row gap-4">
          <FavoriteButton data={data} />
          <TagButton data={data} />
        </View>
        <View className="flex-row gap-4">
          <CopyButton data={data} />
          <ShareButton data={data} />
        </View>
      </View>
    </Pressable>
  );
});
