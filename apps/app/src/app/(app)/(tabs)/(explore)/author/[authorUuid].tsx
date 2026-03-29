import { TouchableOpacity, View, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useGetAuthor } from '@/features/author/hooks/use-get-author';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';
import { useToggleFavoriteAuthor } from '@/features/author/hooks/use-toggle-favorite-author';
import { formatLifespan } from '@/features/author/utils/format-lifespan';
import { Text } from '@/shared/components/ui/text';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';
import { QuoteList } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { useTheme } from '@/lib/nativewind/theme.context';
import { haptics } from '@/shared/utils/haptics';
import type { Author } from '@/types/entities';
import { useState } from 'react';

function AuthorHeader({ author }: { author: Author }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const toggleFavorite = useToggleFavoriteAuthor();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFavorite = () => {
    haptics.light();
    scale.value = withSequence(withSpring(1.3, { duration: 150 }), withSpring(1, { duration: 150 }));
    toggleFavorite.mutate({
      uuid: author.uuid,
      isFavorited: author.metadata.favoritedByUser,
    });
  };

  const lifespan = formatLifespan(author);

  return (
    <View className="border-b border-border px-6 pb-6 pt-4">
      <View className="flex-row items-center gap-4">
        <AvatarInitials name={author.name} size="lg" />
        <View className="flex-1">
          <Text className="font-playfair-semi-bold text-heading-medium text-foreground">{author.name}</Text>
          {lifespan && (
            <Text variant="paragraphSmall" className="text-muted-foreground">
              {lifespan}
            </Text>
          )}
          {author.nationality && (
            <Text variant="paragraphSmall" className="text-muted-foreground">
              {author.nationality}
            </Text>
          )}
        </View>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={handleFavorite}
            accessibilityLabel={author.metadata.favoritedByUser ? t('author.removeFavorite') : t('author.addFavorite')}
            hitSlop={12}
          >
            <Ionicons
              name={author.metadata.favoritedByUser ? 'heart' : 'heart-outline'}
              size={24}
              color={author.metadata.favoritedByUser ? colors.destructive : colors.mutedForeground}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {author.wikipediaUrl && (
        <TouchableOpacity
          onPress={() => Linking.openURL(author.wikipediaUrl!)}
          className="mt-3 flex-row items-center gap-1"
        >
          <Ionicons name="link-outline" size={14} color={colors.primary} />
          <Text variant="paragraphSmall" className="text-primary">
            Wikipedia
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function AuthorBio({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const isLong = bio.length > 150;

  return (
    <View className="px-6 py-4">
      <Text variant="paragraphSmall" semiBold className="mb-2 text-foreground">
        {t('author.about')}
      </Text>
      <Text variant="paragraphSmall" className="text-muted-foreground" numberOfLines={expanded ? undefined : 3}>
        {bio}
      </Text>
      {isLong && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)} className="mt-1">
          <Text variant="paragraphSmall" semiBold className="text-secondary">
            {expanded ? t('author.readLess') : t('author.readMore')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function AuthorStats({ author }: { author: Author }) {
  const { t } = useTranslation();
  return (
    <View className="mt-4 flex-row gap-3 px-6 pb-4">
      <View className="flex-1 items-center rounded-xl bg-muted py-3">
        <Text variant="headingSmall" bold className="text-foreground">
          {author.metadata.totalQuotes}
        </Text>
        <Text variant="paragraphCaption" className="text-muted-foreground">
          {t('author.quotes')}
        </Text>
      </View>
      <View className="flex-1 items-center rounded-xl bg-muted py-3">
        <Text variant="headingSmall" bold className="text-foreground">
          {author.metadata.totalFavorites}
        </Text>
        <Text variant="paragraphCaption" className="text-muted-foreground">
          {t('author.favorited')}
        </Text>
      </View>
    </View>
  );
}

export default function AuthorDetailScreen() {
  const { authorUuid } = useLocalSearchParams<{ authorUuid: string }>();
  const { data: author } = useGetAuthor({ authorUuid: authorUuid });

  return (
    <View className="flex-1 bg-background">
      {author && (
        <>
          <AuthorHeader author={author} />
          <AuthorStats author={author} />
          {author.bio && <AuthorBio bio={author.bio} />}
        </>
      )}

      <TagQuoteBottomSheetProvider>
        <AuthorQuotes authorUuid={authorUuid} />
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
