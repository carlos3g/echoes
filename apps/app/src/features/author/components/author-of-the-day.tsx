import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useGetDailyAuthor } from '@/features/author/hooks/use-get-daily-author';
import { formatLifespan } from '@/features/author/utils/format-lifespan';
import { Text } from '@/shared/components/ui/text';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';
import { useTheme } from '@/lib/nativewind/theme.context';

export const AuthorOfTheDay: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { author, isLoading } = useGetDailyAuthor();

  if (isLoading || !author) return null;

  const lifespan = formatLifespan(author);

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} className="px-4 pt-3">
      <View className="mb-2 flex-row items-center gap-2">
        <Ionicons name="star" size={14} color={colors.primary} />
        <Text variant="paragraphSmall" semiBold className="text-foreground">
          {t('author.authorOfTheDay')}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/(app)/(tabs)/(explore)/author/[authorUuid]',
            params: { authorUuid: author.uuid },
          })
        }
        className="rounded-2xl border border-border bg-card p-4"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-4">
          <AvatarInitials name={author.name} size="md" />
          <View className="flex-1">
            <Text className="font-playfair-semi-bold text-heading-small text-foreground">{author.name}</Text>
            {(lifespan || author.nationality) && (
              <Text variant="paragraphCaptionSmall" className="mt-0.5 text-muted-foreground">
                {[lifespan, author.nationality].filter(Boolean).join(' · ')}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </View>

        {author.bio && (
          <Text variant="paragraphSmall" className="mt-3 text-muted-foreground" numberOfLines={2}>
            {author.bio}
          </Text>
        )}

        <View className="mt-3 flex-row gap-4">
          <Text variant="paragraphCaptionSmall" className="text-secondary">
            {author.metadata.totalQuotes} {t('author.quotes').toLowerCase()}
          </Text>
          <Text variant="paragraphCaptionSmall" className="text-secondary">
            {author.metadata.totalFavorites} {t('common.favorites')}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
