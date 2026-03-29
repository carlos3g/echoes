import React from 'react';
import { TouchableOpacity } from 'react-native';
import { haptics } from '@/shared/utils/haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import type { Quote } from '@/types/entities';
import { cn, humanizeNumber } from '@/shared/utils';
import { Text } from '@/shared/components/ui/text';
import { useToggleFavoriteQuote } from '@/features/quote/hooks/use-toggle-favorite-quote';
import { Ionicons } from '@/lib/nativewind/components';

interface FavoriteButtonProps {
  data: Quote;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = (props) => {
  const { data } = props;
  const { metadata } = data;
  const { t } = useTranslation();

  const toggleFavoriteMutation = useToggleFavoriteQuote();
  const scale = useSharedValue(1);

  const formattedFavorites = humanizeNumber(metadata?.favorites);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFavorite = () => {
    haptics.light();
    scale.value = withSequence(withSpring(1.3, { duration: 150 }), withSpring(1, { duration: 150 }));
    toggleFavoriteMutation.mutate({
      uuid: data.uuid,
      isFavorited: !!metadata?.favoritedByUser,
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        testID="toggle-favorite-button"
        className="flex-row items-center gap-1"
        onPress={handleFavorite}
        accessibilityLabel={metadata?.favoritedByUser ? t('quote.removeFavorite') : t('quote.addFavorite')}
        accessibilityRole="button"
        activeOpacity={0.7}
        hitSlop={12}
      >
        <Ionicons
          name={metadata?.favoritedByUser ? 'heart' : 'heart-outline'}
          size={20}
          className={metadata?.favoritedByUser ? 'text-destructive' : 'text-muted-foreground'}
        />
        <Text
          variant="paragraphSmall"
          className={cn('text-muted-foreground', metadata?.favoritedByUser && 'text-destructive')}
        >
          {formattedFavorites}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
