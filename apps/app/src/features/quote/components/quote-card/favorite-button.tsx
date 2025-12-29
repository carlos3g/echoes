import React from 'react';
import { TouchableOpacity } from 'react-native';
import type { Quote } from '@/types/entities';
import { cn, humanizeNumber } from '@/shared/utils';
import { Text } from '@/shared/components/ui/text';
import { useFavoriteQuote } from '@/features/quote/hooks/use-favorite-quote';
import { useUnfavoriteQuote } from '@/features/quote/hooks/use-unfavorite-quote';
import { Ionicons } from '@/lib/nativewind/components';

interface FavoriteButtonProps {
  data: Quote;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = (props) => {
  const { data } = props;
  const { metadata } = data;

  const favoriteMutation = useFavoriteQuote();
  const unfavoriteMutation = useUnfavoriteQuote();

  const formattedFavorites = humanizeNumber(metadata?.favorites);

  const handleFavorite = () => {
    if (metadata?.favoritedByUser) {
      unfavoriteMutation.mutate(data.uuid);
      return;
    }

    favoriteMutation.mutate(data.uuid);
  };

  return (
    <TouchableOpacity testID="toggle-favorite-button" className="flex-row items-center gap-1" onPress={handleFavorite}>
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
