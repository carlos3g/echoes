import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
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

  const toggleFavoriteMutation = useToggleFavoriteQuote();

  const formattedFavorites = humanizeNumber(metadata?.favorites);

  const handleFavorite = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavoriteMutation.mutate({
      uuid: data.uuid,
      isFavorited: !!metadata?.favoritedByUser,
    });
  };

  return (
    <TouchableOpacity
      testID="toggle-favorite-button"
      className="flex-row items-center gap-1"
      onPress={handleFavorite}
      accessibilityLabel={metadata?.favoritedByUser ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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
  );
};
